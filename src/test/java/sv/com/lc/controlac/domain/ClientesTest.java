package sv.com.lc.controlac.domain;

import static org.assertj.core.api.Assertions.assertThat;
import static sv.com.lc.controlac.domain.ClientesTestSamples.*;
import static sv.com.lc.controlac.domain.FacturasTestSamples.*;

import org.junit.jupiter.api.Test;
import sv.com.lc.controlac.web.rest.TestUtil;

class ClientesTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Clientes.class);
        Clientes clientes1 = getClientesSample1();
        Clientes clientes2 = new Clientes();
        assertThat(clientes1).isNotEqualTo(clientes2);

        clientes2.setId(clientes1.getId());
        assertThat(clientes1).isEqualTo(clientes2);

        clientes2 = getClientesSample2();
        assertThat(clientes1).isNotEqualTo(clientes2);
    }

    @Test
    void facturasTest() {
        Clientes clientes = getClientesRandomSampleGenerator();
        Facturas facturasBack = getFacturasRandomSampleGenerator();

        clientes.setFacturas(facturasBack);
        assertThat(clientes.getFacturas()).isEqualTo(facturasBack);
        assertThat(facturasBack.getClientes()).isEqualTo(clientes);

        clientes.facturas(null);
        assertThat(clientes.getFacturas()).isNull();
        assertThat(facturasBack.getClientes()).isNull();
    }
}
