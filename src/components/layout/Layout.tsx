import Header from '@/components/layout/Header';
import PageProgress from '@/components/PageProgress';

let saidHello = false;

const Layout = ({ children }: { children: React.ReactNode }) => {
  if (!saidHello) {
    // sayHello();
    saidHello = true;
  }

  return (
    <>
      <Header />
      <PageProgress color='#ff9a9a' />
      {children}
    </>
  );
};

export default Layout;
