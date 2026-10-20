/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import { lazy } from 'react';
import Dashboard from './pages/Dashboard';
import GeneralPredictionsBoard from './pages/GeneralPredictionsBoard';
import HallOfFame from './pages/HallOfFame';
import KnockoutBracket from './pages/KnockoutBracket';
import Predictions from './pages/Predictions';
import PredictionsResults from './pages/PredictionsResults';
import Replay from './pages/Replay';
import RoundsList from './pages/RoundsList';
import __Layout from './Layout.jsx';

// Loaded on demand, each in its own file: the admin panel (admins only) and
// the stats page (charts library) — the two heaviest screens most visits never open.
const Admin = lazy(() => import('./pages/Admin'));
const MyStats = lazy(() => import('./pages/MyStats'));


export const PAGES = {
    "Admin": Admin,
    "Dashboard": Dashboard,
    "GeneralPredictionsBoard": GeneralPredictionsBoard,
    "HallOfFame": HallOfFame,
    "KnockoutBracket": KnockoutBracket,
    "MyStats": MyStats,
    "Predictions": Predictions,
    "PredictionsResults": PredictionsResults,
    "Replay": Replay,
    "RoundsList": RoundsList,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};