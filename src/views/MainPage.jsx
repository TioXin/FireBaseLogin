import Header from '../components/Header';

function MainPage() {
  const pageTitle = "Página Inicial";

  return (
    <div className="container">
      <Header pageTitle={pageTitle} />
      <div>
        <p>Bem-vindo!</p>
      </div>
    </div>
  );
}

export default MainPage;
