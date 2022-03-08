let saidHello = false;

const Layout = ({ children }: { children: React.ReactNode }) => {
  if (!saidHello) {
    // sayHello();
    saidHello = true;
  }

  return <>{children}</>;
};

export default Layout;
