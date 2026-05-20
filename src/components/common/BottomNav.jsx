import { Link } from 'react-router-dom';

function BottomNav() {
  return (
    <div>
      <Link to="/">Home</Link>
      <Link to="/closet">Closet</Link>
      <Link to="/profile">Profile</Link>
    </div>
  );
}

export default BottomNav;
