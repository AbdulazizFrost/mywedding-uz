import { Link } from 'react-router-dom';

const links = [
  { to: '/', label: 'Главная' },
  { to: '/catalog', label: 'Каталог' },
  { to: '/login', label: 'Вход' },
  { to: '/register', label: 'Регистрация' },
  { to: '/dashboard', label: 'Кабинет' },
];

export default function Navbar() {
  return (
    <nav className="flex gap-4 border-b border-gray-200 px-6 py-4 text-sm">
      {links.map((link) => (
        <Link key={link.to} to={link.to} className="text-gray-600 hover:text-gray-900">
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
