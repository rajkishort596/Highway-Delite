import { Outlet } from "react-router-dom";
import Container from "../components/Container/Container";
import Header from "../components/Header/Header";

const RootLayout = () => {
  return (
    <Container>
      <div className="min-h-screen">
        <Header />
        <main className="relative px-4 lg:px-6 xl:px-31 min-h-screen bg-white">
          <div className="min-h-screen">
            <Outlet />
          </div>
        </main>
      </div>
    </Container>
  );
};

export default RootLayout;
