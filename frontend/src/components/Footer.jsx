import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="bg-dark text-light py-3 mt-auto">
            <Container>

                <Row>
                    <Col className="text-center">
                        <p className="mb-0">
                            &copy; {new Date().getFullYear()} StraBenkarte. Todos los derechos reservados.
                        </p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}