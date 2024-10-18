package sv.com.lc.controlac.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class ProductosTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Productos getProductosSample1() {
        return new Productos().id(1L).descipcion("descipcion1").nombre("nombre1").notas("notas1");
    }

    public static Productos getProductosSample2() {
        return new Productos().id(2L).descipcion("descipcion2").nombre("nombre2").notas("notas2");
    }

    public static Productos getProductosRandomSampleGenerator() {
        return new Productos()
            .id(longCount.incrementAndGet())
            .descipcion(UUID.randomUUID().toString())
            .nombre(UUID.randomUUID().toString())
            .notas(UUID.randomUUID().toString());
    }
}
