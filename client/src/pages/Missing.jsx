import { CContainer } from '@coreui/react'
import { Link } from 'react-router-dom'

const Missing = () => {
  return (
    <CContainer fluid>
      <h1>Oops!</h1>
      <p>Page Not Found</p>
      <Link to="/">Visit Our Homepage</Link>
    </CContainer>
  )
}

export default Missing
