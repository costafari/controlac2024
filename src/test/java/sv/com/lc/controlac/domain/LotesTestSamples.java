package sv.com.lc.controlac.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class LotesTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Lotes getLotesSample1() {
        return new Lotes().id(1L).cantidad(1).lote("lote1");
    }

    public static Lotes getLotesSample2() {
        return new Lotes().id(2L).cantidad(2).lote("lote2");
    }

    public static Lotes getLotesRandomSampleGenerator() {
        return new Lotes().id(longCount.incrementAndGet()).cantidad(intCount.incrementAndGet()).lote(UUID.randomUUID().toString());
    }
}
