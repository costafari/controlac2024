package sv.com.lc.controlac.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static sv.com.lc.controlac.domain.AbonosAsserts.*;
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
import sv.com.lc.controlac.domain.Abonos;
import sv.com.lc.controlac.repository.AbonosRepository;

/**
 * Integration tests for the {@link AbonosResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AbonosResourceIT {

    private static final Long DEFAULT_SALDO_ANTERIOR = 1L;
    private static final Long UPDATED_SALDO_ANTERIOR = 2L;

    private static final Long DEFAULT_ABONO = 1L;
    private static final Long UPDATED_ABONO = 2L;

    private static final Long DEFAULT_NUEVO_SALDO = 1L;
    private static final Long UPDATED_NUEVO_SALDO = 2L;

    private static final String ENTITY_API_URL = "/api/abonos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private AbonosRepository abonosRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAbonosMockMvc;

    private Abonos abonos;

    private Abonos insertedAbonos;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Abonos createEntity() {
        return new Abonos().saldoAnterior(DEFAULT_SALDO_ANTERIOR).abono(DEFAULT_ABONO).nuevoSaldo(DEFAULT_NUEVO_SALDO);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Abonos createUpdatedEntity() {
        return new Abonos().saldoAnterior(UPDATED_SALDO_ANTERIOR).abono(UPDATED_ABONO).nuevoSaldo(UPDATED_NUEVO_SALDO);
    }

    @BeforeEach
    public void initTest() {
        abonos = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedAbonos != null) {
            abonosRepository.delete(insertedAbonos);
            insertedAbonos = null;
        }
    }

    @Test
    @Transactional
    void createAbonos() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Abonos
        var returnedAbonos = om.readValue(
            restAbonosMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(abonos)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Abonos.class
        );

        // Validate the Abonos in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertAbonosUpdatableFieldsEquals(returnedAbonos, getPersistedAbonos(returnedAbonos));

        insertedAbonos = returnedAbonos;
    }

    @Test
    @Transactional
    void createAbonosWithExistingId() throws Exception {
        // Create the Abonos with an existing ID
        abonos.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAbonosMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(abonos)))
            .andExpect(status().isBadRequest());

        // Validate the Abonos in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkSaldoAnteriorIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        abonos.setSaldoAnterior(null);

        // Create the Abonos, which fails.

        restAbonosMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(abonos)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkAbonoIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        abonos.setAbono(null);

        // Create the Abonos, which fails.

        restAbonosMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(abonos)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllAbonos() throws Exception {
        // Initialize the database
        insertedAbonos = abonosRepository.saveAndFlush(abonos);

        // Get all the abonosList
        restAbonosMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(abonos.getId().intValue())))
            .andExpect(jsonPath("$.[*].saldoAnterior").value(hasItem(DEFAULT_SALDO_ANTERIOR.intValue())))
            .andExpect(jsonPath("$.[*].abono").value(hasItem(DEFAULT_ABONO.intValue())))
            .andExpect(jsonPath("$.[*].nuevoSaldo").value(hasItem(DEFAULT_NUEVO_SALDO.intValue())));
    }

    @Test
    @Transactional
    void getAbonos() throws Exception {
        // Initialize the database
        insertedAbonos = abonosRepository.saveAndFlush(abonos);

        // Get the abonos
        restAbonosMockMvc
            .perform(get(ENTITY_API_URL_ID, abonos.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(abonos.getId().intValue()))
            .andExpect(jsonPath("$.saldoAnterior").value(DEFAULT_SALDO_ANTERIOR.intValue()))
            .andExpect(jsonPath("$.abono").value(DEFAULT_ABONO.intValue()))
            .andExpect(jsonPath("$.nuevoSaldo").value(DEFAULT_NUEVO_SALDO.intValue()));
    }

    @Test
    @Transactional
    void getNonExistingAbonos() throws Exception {
        // Get the abonos
        restAbonosMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingAbonos() throws Exception {
        // Initialize the database
        insertedAbonos = abonosRepository.saveAndFlush(abonos);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the abonos
        Abonos updatedAbonos = abonosRepository.findById(abonos.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedAbonos are not directly saved in db
        em.detach(updatedAbonos);
        updatedAbonos.saldoAnterior(UPDATED_SALDO_ANTERIOR).abono(UPDATED_ABONO).nuevoSaldo(UPDATED_NUEVO_SALDO);

        restAbonosMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAbonos.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedAbonos))
            )
            .andExpect(status().isOk());

        // Validate the Abonos in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedAbonosToMatchAllProperties(updatedAbonos);
    }

    @Test
    @Transactional
    void putNonExistingAbonos() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        abonos.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAbonosMockMvc
            .perform(put(ENTITY_API_URL_ID, abonos.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(abonos)))
            .andExpect(status().isBadRequest());

        // Validate the Abonos in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAbonos() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        abonos.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbonosMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(abonos))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abonos in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAbonos() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        abonos.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbonosMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(abonos)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Abonos in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAbonosWithPatch() throws Exception {
        // Initialize the database
        insertedAbonos = abonosRepository.saveAndFlush(abonos);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the abonos using partial update
        Abonos partialUpdatedAbonos = new Abonos();
        partialUpdatedAbonos.setId(abonos.getId());

        partialUpdatedAbonos.saldoAnterior(UPDATED_SALDO_ANTERIOR).abono(UPDATED_ABONO).nuevoSaldo(UPDATED_NUEVO_SALDO);

        restAbonosMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAbonos.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedAbonos))
            )
            .andExpect(status().isOk());

        // Validate the Abonos in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertAbonosUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedAbonos, abonos), getPersistedAbonos(abonos));
    }

    @Test
    @Transactional
    void fullUpdateAbonosWithPatch() throws Exception {
        // Initialize the database
        insertedAbonos = abonosRepository.saveAndFlush(abonos);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the abonos using partial update
        Abonos partialUpdatedAbonos = new Abonos();
        partialUpdatedAbonos.setId(abonos.getId());

        partialUpdatedAbonos.saldoAnterior(UPDATED_SALDO_ANTERIOR).abono(UPDATED_ABONO).nuevoSaldo(UPDATED_NUEVO_SALDO);

        restAbonosMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAbonos.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedAbonos))
            )
            .andExpect(status().isOk());

        // Validate the Abonos in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertAbonosUpdatableFieldsEquals(partialUpdatedAbonos, getPersistedAbonos(partialUpdatedAbonos));
    }

    @Test
    @Transactional
    void patchNonExistingAbonos() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        abonos.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAbonosMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, abonos.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(abonos))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abonos in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAbonos() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        abonos.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbonosMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(abonos))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abonos in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAbonos() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        abonos.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbonosMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(abonos)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Abonos in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAbonos() throws Exception {
        // Initialize the database
        insertedAbonos = abonosRepository.saveAndFlush(abonos);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the abonos
        restAbonosMockMvc
            .perform(delete(ENTITY_API_URL_ID, abonos.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return abonosRepository.count();
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

    protected Abonos getPersistedAbonos(Abonos abonos) {
        return abonosRepository.findById(abonos.getId()).orElseThrow();
    }

    protected void assertPersistedAbonosToMatchAllProperties(Abonos expectedAbonos) {
        assertAbonosAllPropertiesEquals(expectedAbonos, getPersistedAbonos(expectedAbonos));
    }

    protected void assertPersistedAbonosToMatchUpdatableProperties(Abonos expectedAbonos) {
        assertAbonosAllUpdatablePropertiesEquals(expectedAbonos, getPersistedAbonos(expectedAbonos));
    }
}
