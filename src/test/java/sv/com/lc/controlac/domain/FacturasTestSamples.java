package sv.com.lc.controlac.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;

public class FacturasTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Facturas getFacturasSample1() {
        return new Facturas().id(1L).numeroFactura(1L);
    }

    public static Facturas getFacturasSample2() {
        return new Facturas().id(2L).numeroFactura(2L);
    }

    public static Facturas getFacturasRandomSampleGenerator() {
        return new Facturas().id(longCount.incrementAndGet()).numeroFactura(longCount.incrementAndGet());
    }
}
