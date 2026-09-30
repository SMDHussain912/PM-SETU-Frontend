import AppRoutes from './routes/AppRoutes'
import './App.css'

/**
 * App — routing only.
 *
 * The shell (government header, primary nav, footer) lives in the Layout
 * route, so pages no longer import <Header /> individually. Previously
 * /about forgot to import it and rendered with no navigation at all.
 */
const App = () => <AppRoutes />

export default App
