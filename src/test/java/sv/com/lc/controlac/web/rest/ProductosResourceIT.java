package sv.com.lc.controlac.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static sv.com.lc.controlac.domain.ProductosAsserts.*;
import static sv.com.lc.controlac.web.rest.TestUtil.createUpdateProxyForBean;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import sv.com.lc.controlac.IntegrationTest;
import sv.com.lc.controlac.domain.Productos;
import sv.com.lc.controlac.repository.ProductosRepository;

/**
 * Integration tests for the {@link ProductosResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ProductosResourceIT {

    private static final String DEFAULT_DESCIPCION = "AAAAAAAAAA";
    private static final String UPDATED_DESCIPCION = "BBBBBBBBBB";

    private static final String DEFAULT_NOMBRE = "AAAAAAAAAA";
    private static final String UPDATED_NOMBRE = "BBBBBBBBBB";

    private static final String DEFAULT_NOTAS = "AAAAAAAAAA";
    private static final String UPDATED_NOTAS = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/productos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private ProductosRepository productosRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restProductosMockMvc;

    private Productos productos;

    private Productos insertedProductos;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Productos createEntity() {
        return new Productos().descipcion(DEFAULT_DESCIPCION).nombre(DEFAULT_NOMBRE).notas(DEFAULT_NOTAS);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Productos createUpdatedEntity() {
        return new Productos().descipcion(UPDATED_DESCIPCION).nombre(UPDATED_NOMBRE).notas(UPDATED_NOTAS);
    }

    @BeforeEach
    public void initTest() {
        productos = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedProductos != null) {
            productosRepository.delete(insertedProductos);
            insertedProductos = null;
        }
    }

    @Test
    @Transactional
    void createProductos() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Productos
        var returnedProductos = om.readValue(
            restProductosMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(productos)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Productos.class
        );

        // Validate the Productos in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertProductosUpdatableFieldsEquals(returnedProductos, getPersistedProductos(returnedProductos));

        insertedProductos = returnedProductos;
    }

    @Test
    @Transactional
    void createProductosWithExistingId() throws Exception {
        // Create the Productos with an existing ID
        productos.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restProductosMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(productos)))
            .andExpect(status().isBadRequest());

        // Validate the Productos in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllProductos() throws Exception {
        // Initialize the database
        insertedProductos = productosRepository.saveAndFlush(productos);

        // Get all the productosList
        restProductosMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(productos.getId().intValue())))
            .andExpect(jsonPath("$.[*].descipcion").value(hasItem(DEFAULT_DESCIPCION)))
            .andExpect(jsonPath("$.[*].nombre").value(hasItem(DEFAULT_NOMBRE)))
            .andExpect(jsonPath("$.[*].notas").value(hasItem(DEFAULT_NOTAS)));
    }

    @Test
    @Transactional
    void getProductos() throws Exception {
        // Initialize the database
        insertedProductos = productosRepository.saveAndFlush(productos);

        // Get the productos
        restProductosMockMvc
            .perform(get(ENTITY_API_URL_ID, productos.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(productos.getId().intValue()))
            .andExpect(jsonPath("$.descipcion").value(DEFAULT_DESCIPCION))
            .andExpect(jsonPath("$.nombre").value(DEFAULT_NOMBRE))
            .andExpect(jsonPath("$.notas").value(DEFAULT_NOTAS));
    }

    @Test
    @Transactional
    void getNonExistingProductos() throws Exception {
        // Get the productos
        restProductosMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingProductos() throws Exception {
        // Initialize the database
        insertedProductos = productosRepository.saveAndFlush(productos);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the productos
        Productos updatedProductos = productosRepository.findById(productos.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedProductos are not directly saved in db
        em.detach(updatedProductos);
        updatedProductos.descipcion(UPDATED_DESCIPCION).nombre(UPDATED_NOMBRE).notas(UPDATED_NOTAS);

        restProductosMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedProductos.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedProductos))
            )
            .andExpect(status().isOk());

        // Validate the Productos in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedProductosToMatchAllProperties(updatedProductos);
    }

    @Test
    @Transactional
    void putNonExistingProductos() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        productos.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProductosMockMvc
            .perform(
                put(ENTITY_API_URL_ID, productos.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(productos))
            )
            .andExpect(status().isBadRequest());

        // Validate the Productos in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchProductos() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        productos.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductosMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(productos))
            )
            .andExpect(status().isBadRequest());

        // Validate the Productos in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamProductos() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        productos.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductosMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(productos)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Productos in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateProductosWithPatch() throws Exception {
        // Initialize the database
        insertedProductos = productosRepository.saveAndFlush(productos);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the productos using partial update
        Productos partialUpdatedProductos = new Productos();
        partialUpdatedProductos.setId(productos.getId());

        restProductosMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProductos.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedProductos))
            )
            .andExpect(status().isOk());

        // Validate the Productos in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertProductosUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedProductos, productos),
            getPersistedProductos(productos)
        );
    }

    @Test
    @Transactional
    void fullUpdateProductosWithPatch() throws Exception {
        // Initialize the database
        insertedProductos = productosRepository.saveAndFlush(productos);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the productos using partial update
        Productos partialUpdatedProductos = new Productos();
        partialUpdatedProductos.setId(productos.getId());

        partialUpdatedProductos.descipcion(UPDATED_DESCIPCION).nombre(UPDATED_NOMBRE).notas(UPDATED_NOTAS);

        restProductosMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProductos.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedProductos))
            )
            .andExpect(status().isOk());

        // Validate the Productos in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertProductosUpdatableFieldsEquals(partialUpdatedProductos, getPersistedProductos(partialUpdatedProductos));
    }

    @Test
    @Transactional
    void patchNonExistingProductos() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        productos.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProductosMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, productos.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(productos))
            )
            .andExpect(status().isBadRequest());

        // Validate the Productos in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchProductos() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        productos.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductosMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(productos))
            )
            .andExpect(status().isBadRequest());

        // Validate the Productos in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamProductos() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        productos.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductosMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(productos)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Productos in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteProductos() throws Exception {
        // Initialize the database
        insertedProductos = productosRepository.saveAndFlush(productos);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the productos
        restProductosMockMvc
            .perform(delete(ENTITY_API_URL_ID, productos.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return productosRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected Productos getPersistedProductos(Productos productos) {
        return productosRepository.findById(productos.getId()).orElseThrow();
    }

    protected void assertPersistedProductosToMatchAllProperties(Productos expectedProductos) {
        assertProductosAllPropertiesEquals(expectedProductos, getPersistedProductos(expectedProductos));
    }

    protected void assertPersistedProductosToMatchUpdatableProperties(Productos expectedProductos) {
        assertProductosAllUpdatablePropertiesEquals(expectedProductos, getPersistedProductos(expectedProductos));
    }
}
