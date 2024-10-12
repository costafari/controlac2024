package sv.com.lc.controlac;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import org.springframework.boot.test.context.SpringBootTest;
import sv.com.lc.controlac.config.AsyncSyncConfiguration;
import sv.com.lc.controlac.config.EmbeddedRedis;
import sv.com.lc.controlac.config.EmbeddedSQL;
import sv.com.lc.controlac.config.JacksonConfiguration;

/**
 * Base composite annotation for integration tests.
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@SpringBootTest(classes = { Controlac2024App.class, JacksonConfiguration.class, AsyncSyncConfiguration.class })
@EmbeddedRedis
@EmbeddedSQL
public @interface IntegrationTest {
}
