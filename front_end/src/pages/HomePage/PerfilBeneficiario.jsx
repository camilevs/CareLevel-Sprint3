import ProfileCard from '../../Components/ProfileCard/ProfileCard'
import NavBar from "../../Components/NavBar/NavBar"
import Footer from "../../Components/Footer/Footer"

export default function PerfilBeneficiario() {
    return (
        <main className="min-h-screen w-full pb-12 flex flex-col items-stretch bg-[var(--bg-primary)]">
            <NavBar />
            <ProfileCard />
            <Footer />
        </main>
    )
}
