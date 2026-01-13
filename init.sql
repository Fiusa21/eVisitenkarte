--
-- PostgreSQL database dump
--



-- Dumped from database version 15.14
-- Dumped by pg_dump version 18.0

-- Started on 2026-01-12 15:54:08 CET

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 214 (class 1259 OID 16389)
-- Name: elements; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.elements (
    element_id bigint NOT NULL,
    typ character varying(30) NOT NULL,
    uri text,
    layout_id bigint NOT NULL,
    pos_x double precision NOT NULL,
    pos_y double precision NOT NULL,
    size_x double precision NOT NULL,
    size_y double precision NOT NULL,
    source character varying(50),
    style jsonb
);


--
-- TOC entry 215 (class 1259 OID 16394)
-- Name: layouts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.layouts (
    layout_id bigint NOT NULL,
    erstelldatum date NOT NULL,
    name character varying(30),
    user_id_ersteller text
);


--
-- TOC entry 216 (class 1259 OID 24614)
-- Name: layouts_layout_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.layouts ALTER COLUMN layout_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.layouts_layout_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 3265 (class 2606 OID 24596)
-- Name: elements elemente_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.elements
    ADD CONSTRAINT elemente_pkey PRIMARY KEY (element_id);


--
-- TOC entry 3267 (class 2606 OID 24582)
-- Name: layouts layouts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.layouts
    ADD CONSTRAINT layouts_pkey PRIMARY KEY (layout_id);


--
-- TOC entry 3268 (class 2606 OID 24626)
-- Name: elements elements_layout_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.elements
    ADD CONSTRAINT elements_layout_id_fkey FOREIGN KEY (layout_id) REFERENCES public.layouts(layout_id) ON DELETE CASCADE;


--
-- TOC entry 3269 (class 2606 OID 24616)
-- Name: elements fk_layout_element; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.elements
    ADD CONSTRAINT fk_layout_element FOREIGN KEY (layout_id) REFERENCES public.layouts(layout_id) ON DELETE CASCADE;


--
-- TOC entry 3270 (class 2606 OID 24621)
-- Name: elements layout_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.elements
    ADD CONSTRAINT layout_id FOREIGN KEY (layout_id) REFERENCES public.layouts(layout_id) ON DELETE CASCADE;


-- Completed on 2026-01-12 15:54:09 CET

--
-- PostgreSQL database dump complete
--



