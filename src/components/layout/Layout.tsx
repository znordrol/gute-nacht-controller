import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import sayHello from '@/lib/sayHello';

type LayoutProps = {
  children: React.ReactNode;
  hewwo?: boolean;
  trueFooter?: boolean;
};

let saidHello = false;

const Layout = ({
  children,
  hewwo = true,
  trueFooter = false,
}: LayoutProps) => {
  if (hewwo && !saidHello) {
    sayHello();
    saidHello = true;
  }

  return (
    <div className='flex min-h-screen flex-col justify-between'>
      <Header />
      {children}
      <Footer trueFooter={trueFooter} />
    </div>
  );
};

export default Layout;
