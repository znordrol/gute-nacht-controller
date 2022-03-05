import { createOrUpdateTextFile } from '@octokit/plugin-create-or-update-text-file';
import { Octokit } from 'octokit';

const octokit = new (Octokit.plugin(createOrUpdateTextFile))({
  auth: process.env.PERSONAL_ACCESS_TOKEN,
});

type UpdateFileOptions = {
  owner?: string;
  repo: string;
  path: string;
  content: string;
  message: string;
};

export const updateFile = async ({
  owner = 'lordronz',
  repo,
  path,
  content,
  message,
}: UpdateFileOptions) => {
  const { updated } = await octokit.createOrUpdateTextFile({
    owner,
    repo,
    path,
    content,
    message,
  });

  if (updated) {
    console.log(`${path} updated`);
  } else {
    console.log(`${path} already up to date`);
  }
};
