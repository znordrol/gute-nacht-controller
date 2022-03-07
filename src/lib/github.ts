import { createOrUpdateTextFile } from '@octokit/plugin-create-or-update-text-file';
import { Octokit } from 'octokit';

const octokit = new (Octokit.plugin(createOrUpdateTextFile))({
  auth: process.env.PERSONAL_ACCESS_TOKEN,
});

type GetFileOptions = {
  owner?: string;
  repo?: string;
  path: string;
};

type GetFileResponseData = {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: string;
  content: string;
  encoding: string;
  _links: {
    self: string;
    git: string;
    html: string;
  };
};

export const getFile = async ({
  owner = 'lordronz',
  repo = 'gute-nacht',
  path,
}: GetFileOptions) => {
  const { data } = (await octokit.rest.repos.getContent({
    owner,
    repo,
    path,
  })) as { data: GetFileResponseData };

  return Buffer.from(data.content, 'base64').toString();
};

type UpdateFileOptions = {
  owner?: string;
  repo?: string;
  path: string;
  content: string;
  message: string;
};

export const updateFile = async ({
  owner = 'lordronz',
  repo = 'gute-nacht',
  path,
  content,
  message,
}: UpdateFileOptions) => {
  await octokit.createOrUpdateTextFile({
    owner,
    repo,
    path,
    content,
    message,
  });
};

type TriggerWorkflowOptions = {
  repo?: string;
  owner?: string;
  workflow_id?: string;
  ref?: string;
};

export const triggerWorkflow = async ({
  owner = 'lordronz',
  repo = 'gute-nacht',
  workflow_id = 'gute_nacht.yml',
  ref = 'main',
}: TriggerWorkflowOptions) => {
  await octokit.rest.actions.createWorkflowDispatch({
    owner,
    repo,
    workflow_id,
    ref,
  });
};
