package sv.com.lc.controlac.domain;

import static org.assertj.core.api.Assertions.assertThat;
import static sv.com.lc.controlac.domain.AbonosTestSamples.*;
import static sv.com.lc.controlac.domain.ClientesTestSamples.*;
import static sv.com.lc.controlac.domain.DetallesTestSamples.*;
import static sv.com.lc.controlac.domain.FacturasTestSamples.*;
import static sv.com.lc.controlac.domain.LotesTestSamples.*;

import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;
import sv.com.lc.controlac.web.rest.TestUtil;

class FacturasTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Facturas.class);
        Facturas facturas1 = getFacturasSample1();
        Facturas facturas2 = new Facturas();
        assertThat(facturas1).isNotEqualTo(facturas2);

        facturas2.setId(facturas1.getId());
        assertThat(facturas1).isEqualTo(facturas2);

        facturas2 = getFacturasSample2();
        assertThat(facturas1).isNotEqualTo(facturas2);
    }

    @Test
    void clientesTest() {
        Facturas facturas = getFacturasRandomSampleGenerator();
        Clientes clientesBack = getClientesRandomSampleGenerator();

        facturas.setClientes(clientesBack);
        assertThat(facturas.getClientes()).isEqualTo(clientesBack);

        facturas.clientes(null);
        assertThat(facturas.getClientes()).isNull();
    }

    @Test
    void lotesTest() {
        Facturas facturas = getFacturasRandomSampleGenerator();
        Lotes lotesBack = getLotesRandomSampleGenerator();

        facturas.setLotes(lotesBack);
        assertThat(facturas.getLotes()).isEqualTo(lotesBack);

        facturas.lotes(null);
        assertThat(facturas.getLotes()).isNull();
    }

    @Test
    void detallesTest() {
        Facturas facturas = getFacturasRandomSampleGenerator();
        Detalles detallesBack = getDetallesRandomSampleGenerator();

        facturas.setDetalles(detallesBack);
        assertThat(facturas.getDetalles()).isEqualTo(detallesBack);

        facturas.detalles(null);
        assertThat(facturas.getDetalles()).isNull();
    }

    @Test
    void abonosTest() {
        Facturas facturas = getFacturasRandomSampleGenerator();
        Abonos abonosBack = getAbonosRandomSampleGenerator();

        facturas.addAbonos(abonosBack);
        assertThat(facturas.getAbonos()).containsOnly(abonosBack);
        assertThat(abonosBack.getFacturas()).isEqualTo(facturas);

        facturas.removeAbonos(abonosBack);
        assertThat(facturas.getAbonos()).doesNotContain(abonosBack);
        assertThat(abonosBack.getFacturas()).isNull();

        facturas.abonos(new HashSet<>(Set.of(abonosBack)));
        assertThat(facturas.getAbonos()).containsOnly(abonosBack);
        assertThat(abonosBack.getFacturas()).isEqualTo(facturas);

        facturas.setAbonos(new HashSet<>());
        assertThat(facturas.getAbonos()).doesNotContain(abonosBack);
        assertThat(abonosBack.getFacturas()).isNull();
    }
}
