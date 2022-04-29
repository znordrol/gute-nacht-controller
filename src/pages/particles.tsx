import type { NextPage } from 'next';

import Layout from '@/components/layout/Layout';
import ParticleComponent from '@/components/ParticleComponent';
import Seo from '@/components/Seo';

const ParticlesPage: NextPage = () => (
  <Layout hewwo={false}>
    <Seo templateTitle='Particles' />
    <main>
      <section className='bg-black text-primary-50'>
        <ParticleComponent />
      </section>
    </main>
  </Layout>
);

export default ParticlesPage;
