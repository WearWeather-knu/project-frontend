import { Link } from 'react-router-dom';

function Header() {
  return (
    <div>
      <Link to="/comparision">구름</Link>
      메인 로고
      <Link to="/history">기록</Link>
    </div>
  );
}

export default Header;
