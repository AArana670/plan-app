import {React, Children} from "react";
import "../styles/welcome.css"
import { LogoHalf } from "../components/logoHalf";

export function HeaderBtn({path, children}) {

    return (
    <a href={path}>
        {children}
    </a>);
}

const Welcome = () => {
    return (
    <div className="split">
        <LogoHalf/>
        <div className="about-half">
            <header className="welcome-header">
                <HeaderBtn className="header-link" path="./login">Inicio</HeaderBtn>
                <HeaderBtn className="header-link" path="#about">Sobre nosotros</HeaderBtn>
                <HeaderBtn className="header-link" path="#services">Servicios</HeaderBtn>
                <HeaderBtn className="header-link" path="#contact">Contacto</HeaderBtn>
            </header>
            <main>
                <article id="welcome">
                    <h1>
                        Bienvenido
                    </h1>
                    <p>
                        Soy Aitor Arana, y tengo una pregunta que hacerte: ¿acaso un hombre no tiene derecho al sudor de su propia frente? No, dice el hombre de Washington. Pertenece a los pobres. No, dice el hombre del Vaticano. Pertenece a Dios. No, dice el hombre de Moscú. Pertenece a todos. Yo rechacé esas respuestas. En vez de eso, elegí algo distinto. Elegí lo imposible. Elegí... Plan A. Una herramienta donde el artista no tenía que temer al censor. Donde el científico no estaba limitado por la nimia moral. Donde los grandes no estaban constreñidos por los pequeños. Y con el sudor de tu frente, ¡Plan A también puede ser tu herramienta! 
                    </p>
                </article>
                <article id="about">
                    <h1>
                        Sobre nosotros
                    </h1>
                    <p>
                        Surgió una idea, y Riesco la conoce. Llamada la Iniciativa Plan A. La idea era buscar y reunir a un grupo de personas excepcionales, y tratar de convertirlas en algo más. Ver si podían unirse cuando necesitáramos que libraran las batallas que no podríamos ganar.
                    </p>
                </article>
                <article id="services">
                    <h1>
                        Servicios
                    </h1>
                    <p>
                        É um grande orgulho nacional o queijo Mineiro, em especial o Queijo canastra, e vem sendo premiado frequente em concursos nacionais (como o prêmio queijo Brasil) e internacionais (como o “Mondial du Fromage”, na França). Queijeiros como a Solange da fazenda capão grande, Alan do Queijo do Dinho e Vinicius produtor do queijo canastra faz o bem orgânico fazem parte do time de pequenos produtores responsáveis por essas vitórias gastronômicas do estado de Minas e são parceiras do Mineiro do Queijo.  Outros produtos como alguns doces e cachaças que trabalhamos também são produtos premiados.
                    </p>
                </article>
                <article id="contact">
                    <h1>
                        Contacto
                    </h1>
                    <p>
                        <a href="mailto:pa.planapp@gmail.com">pa.planapp@gmail.com</a>
                    </p>
                    <div className="socials">
                        <a href="https://www.youtube.com/@VaatiVidya" target="_blank">
                            <img src="icons/instagram_dark.svg" alt="instagram" className="social-icon" />
                        </a>
                        <a href="https://www.youtube.com/@VaatiVidya" target="_blank">
                            <img src="icons/twitter_dark.svg" alt="twitter" className="social-icon" />
                        </a>
                        <a href="https://www.youtube.com/@VaatiVidya" target="_blank">
                            <img src="icons/tiktok.svg" alt="tiktok" className="social-icon" />
                        </a>
                    </div>
                </article>
            </main>
        </div>
    </div>);
};

export default Welcome;
