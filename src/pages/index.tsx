import type { NextPage } from 'next';

import Seo from '@/components/Seo';

const Home: NextPage = () => {
  return (
    <>
      <Seo />
      <main>
        <section>
          <div className='layout min-h-screen space-y-10 py-10'>
            <div className='space-y-8'>
              <h1>Haloo {'<3'}</h1>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
