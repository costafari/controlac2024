package sv.com.lc.controlac.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class ClientesTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Clientes getClientesSample1() {
        return new Clientes()
            .id(1L)
            .apellidos("apellidos1")
            .direcion("direcion1")
            .email("email1")
            .nombreContacto("nombreContacto1")
            .nombreEmpresa("nombreEmpresa1")
            .nombres("nombres1")
            .notas("notas1")
            .sitioWeb("sitioWeb1")
            .telefonoFijo(1)
            .telefonoFijo2(1)
            .telefonoMovil(1)
            .telefonoMovil2(1);
    }

    public static Clientes getClientesSample2() {
        return new Clientes()
            .id(2L)
            .apellidos("apellidos2")
            .direcion("direcion2")
            .email("email2")
            .nombreContacto("nombreContacto2")
            .nombreEmpresa("nombreEmpresa2")
            .nombres("nombres2")
            .notas("notas2")
            .sitioWeb("sitioWeb2")
            .telefonoFijo(2)
            .telefonoFijo2(2)
            .telefonoMovil(2)
            .telefonoMovil2(2);
    }

    public static Clientes getClientesRandomSampleGenerator() {
        return new Clientes()
            .id(longCount.incrementAndGet())
            .apellidos(UUID.randomUUID().toString())
            .direcion(UUID.randomUUID().toString())
            .email(UUID.randomUUID().toString())
            .nombreContacto(UUID.randomUUID().toString())
            .nombreEmpresa(UUID.randomUUID().toString())
            .nombres(UUID.randomUUID().toString())
            .notas(UUID.randomUUID().toString())
            .sitioWeb(UUID.randomUUID().toString())
            .telefonoFijo(intCount.incrementAndGet())
            .telefonoFijo2(intCount.incrementAndGet())
            .telefonoMovil(intCount.incrementAndGet())
            .telefonoMovil2(intCount.incrementAndGet());
    }
}
