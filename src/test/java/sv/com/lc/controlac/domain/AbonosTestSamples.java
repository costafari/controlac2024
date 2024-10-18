package sv.com.lc.controlac.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;

public class AbonosTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Abonos getAbonosSample1() {
        return new Abonos().id(1L).saldoAnterior(1L).abono(1L).nuevoSaldo(1L);
    }

    public static Abonos getAbonosSample2() {
        return new Abonos().id(2L).saldoAnterior(2L).abono(2L).nuevoSaldo(2L);
    }

    public static Abonos getAbonosRandomSampleGenerator() {
        return new Abonos()
            .id(longCount.incrementAndGet())
            .saldoAnterior(longCount.incrementAndGet())
            .abono(longCount.incrementAndGet())
            .nuevoSaldo(longCount.incrementAndGet());
    }
}
