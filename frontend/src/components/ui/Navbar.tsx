import { Link, useNavigate } from 'react-router-dom';
import { Button } from "../shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../shadcn/dropdown-menu";
import { Menu, Moon, Sun } from 'lucide-react';
import { useDarkMode } from '../../contexts/DarkModeProvider';
import { AuthStatus, useAuth } from '../../contexts/AuthenticationProvider';

export default function Navbar() {
  const navigate = useNavigate();
  const {darkModeState, toggleDarkMode} = useDarkMode();
  const {authState} = useAuth()

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <nav className="sticky top-0 bg-white dark:bg-gray-700 shadow-sm dark:shadow-gray-800 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-green-600 dark:text-green-400">Slither&Solve</Link>
        </div>
        <div className="hidden md:flex space-x-4">
        </div>
        {
          authState.status === AuthStatus.UNAUTHENTICATED && <div className="hidden md:flex space-x-2">
            <Button variant="outline" asChild><Link to="/authentication?mode=login" className="dark:text-gray-200 dark:hover:text-white">Log in</Link></Button>
            <Button asChild className="bg-green-500 hover:bg-green-600 text-white"><Link to="/authentication?mode=sign-up">Sign up</Link></Button>
            <Button variant="outline" size="icon" onClick={toggleDarkMode} className="dark:border-gray-600 dark:text-gray-200 dark:hover:text-white dark:hover:border-gray-400">
              {darkModeState ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        }
        {
          authState.status === AuthStatus.AUTHENTICATED && <div className="hidden md:flex space-x-2">
            <Button variant="outline" asChild><Link to="/dashboard" className="dark:text-gray-200 dark:hover:text-white">Dashboard</Link></Button>
            <Button variant="outline" size="icon" onClick={toggleDarkMode} className="dark:border-gray-600 dark:text-gray-200 dark:hover:text-white dark:hover:border-gray-400">
              {darkModeState ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        }
        {
          authState.status === AuthStatus.LOADING && <div className="hidden md:flex space-x-2">
            <p className='dark:text-white text-bold'>Loading...</p>
            <Button variant="outline" size="icon" onClick={toggleDarkMode} className="dark:border-gray-600 dark:text-gray-200 dark:hover:text-white dark:hover:border-gray-400">
              {darkModeState ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        }
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="dark:border-gray-600 dark:text-gray-200 dark:hover:text-white dark:hover:border-gray-400">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="dark:bg-gray-800 dark:border-gray-700">
              <DropdownMenuItem onSelect={() => handleNavigation('/')} className="dark:text-gray-200 dark:focus:bg-gray-700">Home</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleNavigation('/articles')} className="dark:text-gray-200 dark:focus:bg-gray-700">Articles</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleNavigation('/pricing')} className="dark:text-gray-200 dark:focus:bg-gray-700">Pricing</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleNavigation('/contact')} className="dark:text-gray-200 dark:focus:bg-gray-700">Contact</DropdownMenuItem>
              {
                authState.status === AuthStatus.UNAUTHENTICATED && <>
                  <DropdownMenuItem onSelect={() => handleNavigation('/authentication?mode=login')} className="dark:text-gray-200 dark:focus:bg-gray-700">Log in</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handleNavigation('/authentication?mode=sign-up')} className="dark:text-gray-200 dark:focus:bg-gray-700">Sign up</DropdownMenuItem>
                </>
              }
              <DropdownMenuItem onSelect={toggleDarkMode} className="dark:text-gray-200 dark:focus:bg-gray-700">
                {darkModeState ? 'Light Mode' : 'Dark Mode'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}