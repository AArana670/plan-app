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
            <main className="welcome-main">
                <article id="welcome">
                    <h1>
                        Bienvenida
                    </h1>
                    <p>
                        ¡Bienvenido a Plan A!
                    </p>
                    <p>
                        La plataforma diseñada para revolucionar la gestión de exposiciones y ferias de arte. Optimiza
                        tu trabajo, conecta con otros profesionales y lleva tus proyectos culturales al siguiente nivel.
                        Porque en el arte, improvisar ya no es una opción.
                    </p>
                </article>
                <article id="about">
                    <h1>
                        Sobre nosotros
                    </h1>
                    <p>
                        Plan A es una herramienta digital creada por y para profesionales del arte. Nuestro objetivo es
                        transformar la organización de exposiciones y ferias, ofreciendo una solución inteligente,
                        intuitiva y colaborativa. Impulsamos la profesionalización del sector cultural a través de la
                        innovación, la sostenibilidad y la formación.
                    </p>
                </article>
                <article id="services">
                    <h1>
                        Servicios
                    </h1>
                    <p>
                        Plan A es un software especializado para la planificación de exposiciones y ferias de arte.
                    </p>
                    <p>
                        Ofrecemos:
                    </p>
                    <ul>
                        <li>
                            Gestión integral de proyectos culturales.
                        </li>
                        <li>
                            Automatización inteligente con IA.
                        </li>
                        <li>
                            Espacios de trabajo colaborativos y personalizables.
                        </li>
                        <li>
                            Base de datos de proveedores y materiales reutilizables.
                        </li>
                        <li>
                            Asistencia técnica y consultoría especializada.
                        </li>
                    </ul>
                    <p>
                        Todo en una única plataforma, accesible desde cualquier dispositivo.
                    </p>
                </article>
                <article id="contact">
                    <h1>
                        Contacto
                    </h1>
                    <p>
                        <a href="mailto:pa.planapp@gmail.com">pa.planapp@gmail.com</a>
                    </p>
                    {/*<div className="socials">
                        <a href="https://www.youtube.com/@VaatiVidya" target="_blank">
                            <img src="icons/instagram_dark.svg" alt="instagram" className="social-icon" />
                        </a>
                        <a href="https://www.youtube.com/@VaatiVidya" target="_blank">
                            <img src="icons/twitter_dark.svg" alt="twitter" className="social-icon" />
                        </a>
                        <a href="https://www.youtube.com/@VaatiVidya" target="_blank">
                            <img src="icons/tiktok.svg" alt="tiktok" className="social-icon" />
                        </a>
                    </div>*/}
                </article>
            </main>
        </div>
    </div>);
};

export default Welcome;
