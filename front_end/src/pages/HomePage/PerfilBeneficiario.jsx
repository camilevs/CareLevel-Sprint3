import './PerfilBeneficiario.css'
import ProfileCard from '../../Components/ProfileCard/ProfileCard'
import NavBar from "../../Components/NavBar/NavBar"
import Footer from "../../Components/Footer/Footer"

export default function PerfilBeneficiario() {
    return (
        <main className="profile-page-main">
            <NavBar />
            <ProfileCard />
            <Footer />
        </main>
    )
}