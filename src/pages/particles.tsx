import type { NextPage } from 'next';

import Layout from '@/components/layout/Layout';
import ParticleComponent from '@/components/ParticleComponent';
import Seo from '@/components/Seo';

const ParticlesPage: NextPage = () => (
  <Layout hewwo={false} skipToContent={false}>
    <Seo templateTitle='Particles' />
    <main>
      <section className='relative h-screen'>
        <ParticleComponent />
      </section>
    </main>
  </Layout>
);

export default ParticlesPage;
