import { PatientSectionComponent } from './patient-section.component';
import { PatientData } from '../../models/patient-data.model';

function makeComponent(patientData: Partial<PatientData>): PatientSectionComponent {
  const component = new PatientSectionComponent();
  component.patientData = {
    name: null,
    dob: null,
    goals: null,
    weight: null,
    height: null,
    observations: null,
    ...patientData,
  };
  return component;
}

describe('PatientSectionComponent', () => {
  describe('age', () => {
    it('returns null when there is no date of birth', () => {
      expect(makeComponent({ dob: null }).age).toBeNull();
    });

    it('returns null for an unparseable date', () => {
      expect(makeComponent({ dob: new Date('not-a-date') }).age).toBeNull();
    });

    it('counts a birthday that has already passed this year', () => {
      const now = new Date();
      const dob = new Date(now.getFullYear() - 30, 0, 1);
      expect(makeComponent({ dob }).age).toBe(30);
    });

    it('does not count a birthday still ahead this year', () => {
      const now = new Date();
      const dob = new Date(now.getFullYear() - 30, 11, 31);
      const expected = now.getMonth() === 11 && now.getDate() === 31 ? 30 : 29;
      expect(makeComponent({ dob }).age).toBe(expected);
    });

    it('accepts an ISO string coming from autosave', () => {
      const iso = `${new Date().getFullYear() - 25}-01-01T00:00:00.000Z`;
      expect(makeComponent({ dob: iso as unknown as Date }).age).toBe(25);
    });
  });

  describe('hasSummaryFacts', () => {
    it('is false when weight, height and dob are all empty', () => {
      expect(makeComponent({}).hasSummaryFacts).toBe(false);
    });

    it('is true once a weight is set', () => {
      expect(makeComponent({ weight: 70 }).hasSummaryFacts).toBe(true);
    });
  });
});
