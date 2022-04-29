import Header from '@/components/layout/Header';
import PageProgress from '@/components/PageProgress';
import sayHello from '@/lib/sayHello';

type LayoutProps = {
  children: React.ReactNode;
  hewwo?: boolean;
};

let saidHello = false;

const Layout = ({ children, hewwo = true }: LayoutProps) => {
  if (hewwo && !saidHello) {
    sayHello();
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
