package sv.com.lc.controlac.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static sv.com.lc.controlac.domain.LotesAsserts.*;
import static sv.com.lc.controlac.web.rest.TestUtil.createUpdateProxyForBean;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import java.time.LocalDate;
import java.time.ZoneId;
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
import sv.com.lc.controlac.domain.Lotes;
import sv.com.lc.controlac.repository.LotesRepository;

/**
 * Integration tests for the {@link LotesResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class LotesResourceIT {

    private static final Integer DEFAULT_CANTIDAD = 1;
    private static final Integer UPDATED_CANTIDAD = 2;

    private static final LocalDate DEFAULT_FECHA_ENTRADA = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_FECHA_ENTRADA = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_LOTE = "AAAAAAAAAA";
    private static final String UPDATED_LOTE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/lotes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private LotesRepository lotesRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restLotesMockMvc;

    private Lotes lotes;

    private Lotes insertedLotes;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Lotes createEntity() {
        return new Lotes().cantidad(DEFAULT_CANTIDAD).fechaEntrada(DEFAULT_FECHA_ENTRADA).lote(DEFAULT_LOTE);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Lotes createUpdatedEntity() {
        return new Lotes().cantidad(UPDATED_CANTIDAD).fechaEntrada(UPDATED_FECHA_ENTRADA).lote(UPDATED_LOTE);
    }

    @BeforeEach
    public void initTest() {
        lotes = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedLotes != null) {
            lotesRepository.delete(insertedLotes);
            insertedLotes = null;
        }
    }

    @Test
    @Transactional
    void createLotes() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Lotes
        var returnedLotes = om.readValue(
            restLotesMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(lotes)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Lotes.class
        );

        // Validate the Lotes in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertLotesUpdatableFieldsEquals(returnedLotes, getPersistedLotes(returnedLotes));

        insertedLotes = returnedLotes;
    }

    @Test
    @Transactional
    void createLotesWithExistingId() throws Exception {
        // Create the Lotes with an existing ID
        lotes.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restLotesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(lotes)))
            .andExpect(status().isBadRequest());

        // Validate the Lotes in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllLotes() throws Exception {
        // Initialize the database
        insertedLotes = lotesRepository.saveAndFlush(lotes);

        // Get all the lotesList
        restLotesMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(lotes.getId().intValue())))
            .andExpect(jsonPath("$.[*].cantidad").value(hasItem(DEFAULT_CANTIDAD)))
            .andExpect(jsonPath("$.[*].fechaEntrada").value(hasItem(DEFAULT_FECHA_ENTRADA.toString())))
            .andExpect(jsonPath("$.[*].lote").value(hasItem(DEFAULT_LOTE)));
    }

    @Test
    @Transactional
    void getLotes() throws Exception {
        // Initialize the database
        insertedLotes = lotesRepository.saveAndFlush(lotes);

        // Get the lotes
        restLotesMockMvc
            .perform(get(ENTITY_API_URL_ID, lotes.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(lotes.getId().intValue()))
            .andExpect(jsonPath("$.cantidad").value(DEFAULT_CANTIDAD))
            .andExpect(jsonPath("$.fechaEntrada").value(DEFAULT_FECHA_ENTRADA.toString()))
            .andExpect(jsonPath("$.lote").value(DEFAULT_LOTE));
    }

    @Test
    @Transactional
    void getNonExistingLotes() throws Exception {
        // Get the lotes
        restLotesMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingLotes() throws Exception {
        // Initialize the database
        insertedLotes = lotesRepository.saveAndFlush(lotes);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the lotes
        Lotes updatedLotes = lotesRepository.findById(lotes.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedLotes are not directly saved in db
        em.detach(updatedLotes);
        updatedLotes.cantidad(UPDATED_CANTIDAD).fechaEntrada(UPDATED_FECHA_ENTRADA).lote(UPDATED_LOTE);

        restLotesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedLotes.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedLotes))
            )
            .andExpect(status().isOk());

        // Validate the Lotes in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedLotesToMatchAllProperties(updatedLotes);
    }

    @Test
    @Transactional
    void putNonExistingLotes() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        lotes.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLotesMockMvc
            .perform(put(ENTITY_API_URL_ID, lotes.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(lotes)))
            .andExpect(status().isBadRequest());

        // Validate the Lotes in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchLotes() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        lotes.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLotesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(lotes))
            )
            .andExpect(status().isBadRequest());

        // Validate the Lotes in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamLotes() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        lotes.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLotesMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(lotes)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Lotes in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateLotesWithPatch() throws Exception {
        // Initialize the database
        insertedLotes = lotesRepository.saveAndFlush(lotes);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the lotes using partial update
        Lotes partialUpdatedLotes = new Lotes();
        partialUpdatedLotes.setId(lotes.getId());

        partialUpdatedLotes.lote(UPDATED_LOTE);

        restLotesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLotes.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedLotes))
            )
            .andExpect(status().isOk());

        // Validate the Lotes in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertLotesUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedLotes, lotes), getPersistedLotes(lotes));
    }

    @Test
    @Transactional
    void fullUpdateLotesWithPatch() throws Exception {
        // Initialize the database
        insertedLotes = lotesRepository.saveAndFlush(lotes);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the lotes using partial update
        Lotes partialUpdatedLotes = new Lotes();
        partialUpdatedLotes.setId(lotes.getId());

        partialUpdatedLotes.cantidad(UPDATED_CANTIDAD).fechaEntrada(UPDATED_FECHA_ENTRADA).lote(UPDATED_LOTE);

        restLotesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLotes.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedLotes))
            )
            .andExpect(status().isOk());

        // Validate the Lotes in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertLotesUpdatableFieldsEquals(partialUpdatedLotes, getPersistedLotes(partialUpdatedLotes));
    }

    @Test
    @Transactional
    void patchNonExistingLotes() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        lotes.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLotesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, lotes.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(lotes))
            )
            .andExpect(status().isBadRequest());

        // Validate the Lotes in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchLotes() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        lotes.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLotesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(lotes))
            )
            .andExpect(status().isBadRequest());

        // Validate the Lotes in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamLotes() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        lotes.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLotesMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(lotes)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Lotes in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteLotes() throws Exception {
        // Initialize the database
        insertedLotes = lotesRepository.saveAndFlush(lotes);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the lotes
        restLotesMockMvc
            .perform(delete(ENTITY_API_URL_ID, lotes.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return lotesRepository.count();
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

    protected Lotes getPersistedLotes(Lotes lotes) {
        return lotesRepository.findById(lotes.getId()).orElseThrow();
    }

    protected void assertPersistedLotesToMatchAllProperties(Lotes expectedLotes) {
        assertLotesAllPropertiesEquals(expectedLotes, getPersistedLotes(expectedLotes));
    }

    protected void assertPersistedLotesToMatchUpdatableProperties(Lotes expectedLotes) {
        assertLotesAllUpdatablePropertiesEquals(expectedLotes, getPersistedLotes(expectedLotes));
    }
}
