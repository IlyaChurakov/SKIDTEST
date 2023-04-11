import { Route, Routes } from 'react-router-dom'
import './App.scss'
import Main from './components/main/Main'
import Summary from './components/summary/Summary'

function App() {
	return (
		<div className='App'>
			<Routes>
				<Route path='/' element={<Main />} />
				<Route path='/employees/*' element={<Summary />} />
				<Route path='*' element={<div>Page not found</div>} />
			</Routes>
		</div>
	)
}

export default App
