import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold">404</h1>
      <p>Sahifa topilmadi</p>
      <Link to="/dashboard">Bosh panelga qaytish</Link>
    </div>
  );
}

export default NotFound;