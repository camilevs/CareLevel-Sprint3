import Footer from "../../Components/Footer/Footer";

export default function Unauthorized() {
	return (
		<>
			<main style={{ padding: '3rem 1.5rem', textAlign: 'left' }}>
				<h1>Acesso negado</h1>
				<p>Você não tem permissão para acessar esta página.</p>
			</main>
			<Footer />
		</>
	)
}
