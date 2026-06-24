import About from "./about/About"
import Hero from "./hero/Hero"
import ServMarquee from "./hero/ServMarquee"
import Portfolio from "./portfolio/Portfolio"
import Services from "./services/Services"

const HomePage = () => {
    return (
        <main>
            <Hero />
            <ServMarquee />
            <Services />
            <About />
            <Portfolio />
        </main>
    )
}

export default HomePage