import { Outlet } from "react-router-dom";
import Container from "../components/Container/Container";
import Header from "../components/Header/Header";

const RootLayout = () => {
  return (
    <Container>
      <div className="min-h-screen">
        <main className="relative p-4 lg:p-6 min-h-screen bg-white rounded-tl-xl">
          <Header />
          <div className="min-h-screen">
            <Outlet />
          </div>
        </main>
      </div>
    </Container>
  );
};

export default RootLayout;
