package sv.com.lc.controlac.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;

public class DetallesTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Detalles getDetallesSample1() {
        return new Detalles().id(1L).cantidad(1L).total(1L);
    }

    public static Detalles getDetallesSample2() {
        return new Detalles().id(2L).cantidad(2L).total(2L);
    }

    public static Detalles getDetallesRandomSampleGenerator() {
        return new Detalles().id(longCount.incrementAndGet()).cantidad(longCount.incrementAndGet()).total(longCount.incrementAndGet());
    }
}
