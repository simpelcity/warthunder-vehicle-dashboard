import { Outlet } from 'react-router-dom'

export default function App() {
  return (
    <>
      <main className="fs-5">
        <Outlet />
      </main>
    </>
  )
}