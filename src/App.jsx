import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { SiteHeader, SiteFooter, FloatingActions, ScrollToTop } from "./components/chrome.jsx";
import { useRevealObserver } from "./components/ui.jsx";
import { trackPageView } from "./lib/analytics.js";

import Home from "./pages/Home.jsx";
import Mapa from "./pages/Mapa.jsx";

import PlataformaHub from "./pages/plataforma/Hub.jsx";
import PlataformaModulo from "./pages/plataforma/Modulo.jsx";

import AcademyHub from "./pages/academy/Hub.jsx";
import AcademyPrograma from "./pages/academy/Programa.jsx";

import ConsultingHub from "./pages/consulting/Hub.jsx";
import ConsultingServicio from "./pages/consulting/Servicio.jsx";

import SolucionesHub from "./pages/soluciones/Hub.jsx";
import SolucionRecorrido from "./pages/soluciones/Recorrido.jsx";
import PorModelo from "./pages/soluciones/PorModelo.jsx";

import RecursosHub from "./pages/recursos/Hub.jsx";
import Blog from "./pages/recursos/Blog.jsx";
import Articulo from "./pages/recursos/Articulo.jsx";
import Casos from "./pages/recursos/Casos.jsx";
import Guias from "./pages/recursos/Guias.jsx";
import Webinars from "./pages/recursos/Webinars.jsx";
import Glosario from "./pages/recursos/Glosario.jsx";

import NosotrosHub from "./pages/nosotros/Hub.jsx";
import Historia from "./pages/nosotros/Historia.jsx";
import Equipo from "./pages/nosotros/Equipo.jsx";
import MVV from "./pages/nosotros/MVV.jsx";
import PorQueNetzen from "./pages/nosotros/PorQueNetzen.jsx";
import Eventos from "./pages/nosotros/Eventos.jsx";

import Contacto from "./pages/contacto/Contacto.jsx";
import Legal from "./pages/legal/Legal.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  const location = useLocation();
  useRevealObserver([location.pathname]);
  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname]);
  return (
    <>
      <a href="#main" className="skiplink">Saltar al contenido</a>
      <ScrollToTop />
      <SiteHeader />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/plataforma" element={<PlataformaHub />} />
          <Route path="/plataforma/:slug" element={<PlataformaModulo />} />

          <Route path="/academy" element={<AcademyHub />} />
          <Route path="/academy/:slug" element={<AcademyPrograma />} />

          <Route path="/consulting" element={<ConsultingHub />} />
          <Route path="/consulting/:slug" element={<ConsultingServicio />} />

          <Route path="/soluciones" element={<SolucionesHub />} />
          <Route path="/soluciones/por-modelo" element={<PorModelo />} />
          <Route path="/soluciones/:slug" element={<SolucionRecorrido />} />

          <Route path="/recursos" element={<RecursosHub />} />
          <Route path="/recursos/blog" element={<Blog />} />
          <Route path="/recursos/blog/articulo" element={<Articulo />} />
          <Route path="/recursos/casos" element={<Casos />} />
          <Route path="/recursos/guias" element={<Guias />} />
          <Route path="/recursos/webinars" element={<Webinars />} />
          <Route path="/recursos/glosario" element={<Glosario />} />

          <Route path="/nosotros" element={<NosotrosHub />} />
          <Route path="/nosotros/historia" element={<Historia />} />
          <Route path="/nosotros/equipo" element={<Equipo />} />
          <Route path="/nosotros/mision-vision-valores" element={<MVV />} />
          <Route path="/nosotros/por-que-netzen" element={<PorQueNetzen />} />
          <Route path="/nosotros/eventos" element={<Eventos />} />

          <Route path="/contacto" element={<Contacto />} />
          <Route path="/contacto/demo" element={<Contacto demo />} />

          <Route path="/legal/privacidad" element={<Legal type="privacy" />} />
          <Route path="/legal/terminos" element={<Legal type="terms" />} />

          <Route path="/mapa" element={<Mapa />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <SiteFooter />
      <FloatingActions />
    </>
  );
}
