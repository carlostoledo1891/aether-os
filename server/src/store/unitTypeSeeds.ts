/**
 * Canonical unit type definitions for the Caldeira project.
 *
 * Each UnitTypeDef drives:
 *   - State machine validation (states + transitions)
 *   - Seed data schema (fields)
 *   - Inspector UI sections
 *   - Map marker rendering (color + icon)
 *
 * 15 types covering the full operational domain.
 */
import type { UnitTypeDef } from '../types/unitTypes.js'

export const UNIT_TYPE_SITE: UnitTypeDef = {
  id: 'site',
  label: 'Site',
  color: '#7C5CFC',
  icon: 'map-pin',
  states: [
    { id: 'active', label: 'Active', severity: 'nominal' },
    { id: 'suspended', label: 'Suspended', severity: 'blocked' },
  ],
  transitions: [
    { from: 'active', to: 'suspended', label: 'Suspend Operations' },
    { from: 'suspended', to: 'active', label: 'Resume Operations' },
  ],
  schema: [
    { key: 'projectName', label: 'Project Name', type: 'string' },
    { key: 'companyName', label: 'Company', type: 'string' },
    { key: 'center', label: 'Center', type: 'coordinates' },
  ],
  metrics: [],
  inspectorSections: [
    { type: 'fields', label: 'Site Details' },
    { type: 'children', label: 'Deposits & Infrastructure' },
    { type: 'timeline', label: 'History' },
  ],
}

export const UNIT_TYPE_DEPOSIT: UnitTypeDef = {
  id: 'deposit',
  label: 'Deposit',
  color: '#D97706',
  icon: 'layers',
  states: [
    { id: 'exploration', label: 'Exploration', severity: 'nominal' },
    { id: 'inferred', label: 'Inferred Resource', severity: 'nominal' },
    { id: 'indicated', label: 'Indicated Resource', severity: 'nominal' },
    { id: 'measured', label: 'Measured Resource', severity: 'nominal' },
    { id: 'reserve', label: 'Ore Reserve', severity: 'nominal' },
    { id: 'depleted', label: 'Depleted', severity: 'attention' },
  ],
  transitions: [
    { from: 'exploration', to: 'inferred', label: 'Classify Inferred', requiredEvidence: ['mre_report'] },
    { from: 'inferred', to: 'indicated', label: 'Upgrade to Indicated', requiredEvidence: ['mre_report'] },
    { from: 'indicated', to: 'measured', label: 'Upgrade to Measured', requiredEvidence: ['mre_report'] },
    { from: 'measured', to: 'reserve', label: 'Convert to Reserve', requiredEvidence: ['feasibility_study'] },
    { from: 'reserve', to: 'depleted', label: 'Mark Depleted' },
  ],
  schema: [
    { key: 'name', label: 'Name', type: 'string' },
    { key: 'status', label: 'Classification', type: 'enum', enumValues: ['exploration', 'inferred', 'indicated', 'measured'] },
    { key: 'treo_ppm', label: 'TREO Grade', type: 'number', unit: 'ppm' },
    { key: 'mreo_pct', label: 'MREO', type: 'number', unit: '%' },
    { key: 'tonnage_mt', label: 'Tonnage', type: 'number', unit: 'Mt' },
    { key: 'clay_depth_avg_m', label: 'Avg Clay Depth', type: 'number', unit: 'm' },
    { key: 'clay_depth_max_m', label: 'Max Clay Depth', type: 'number', unit: 'm' },
    { key: 'area_km2', label: 'Area', type: 'number', unit: 'km²' },
    { key: 'center', label: 'Center', type: 'coordinates' },
  ],
  metrics: [
    { key: 'treo_ppm', label: 'TREO', unit: 'ppm' },
    { key: 'tonnage_mt', label: 'Tonnage', unit: 'Mt' },
    { key: 'mreo_pct', label: 'MREO', unit: '%' },
  ],
  inspectorSections: [
    { type: 'fields', label: 'Geology' },
    { type: 'children', label: 'Drill Holes' },
    { type: 'graph', label: 'Dependencies' },
    { type: 'evidence', label: 'Evidence' },
    { type: 'timeline', label: 'History' },
  ],
}

export const UNIT_TYPE_DRILLHOLE: UnitTypeDef = {
  id: 'drillhole',
  label: 'Drill Hole',
  color: '#6366F1',
  icon: 'crosshair',
  states: [
    { id: 'planned', label: 'Planned', severity: 'nominal' },
    { id: 'in_progress', label: 'Drilling', severity: 'attention' },
    { id: 'completed', label: 'Completed', severity: 'nominal' },
    { id: 'assayed', label: 'Assayed', severity: 'nominal' },
    { id: 'abandoned', label: 'Abandoned', severity: 'attention' },
  ],
  transitions: [
    { from: 'planned', to: 'in_progress', label: 'Start Drilling' },
    { from: 'in_progress', to: 'completed', label: 'Complete Drilling' },
    { from: 'completed', to: 'assayed', label: 'Assay Results', requiredEvidence: ['assay_report'] },
    { from: 'planned', to: 'abandoned', label: 'Abandon' },
    { from: 'in_progress', to: 'abandoned', label: 'Abandon' },
  ],
  schema: [
    { key: 'hole_id', label: 'Hole ID', type: 'string' },
    { key: 'depth_m', label: 'Total Depth', type: 'number', unit: 'm' },
    { key: 'azimuth', label: 'Azimuth', type: 'number', unit: '°' },
    { key: 'dip', label: 'Dip', type: 'number', unit: '°' },
    { key: 'coordinates', label: 'Collar', type: 'coordinates' },
  ],
  metrics: [
    { key: 'depth_m', label: 'Depth', unit: 'm' },
  ],
  inspectorSections: [
    { type: 'fields', label: 'Collar Data' },
    { type: 'graph', label: 'Deposit Link' },
    { type: 'evidence', label: 'Assay Data' },
    { type: 'timeline', label: 'History' },
  ],
}

export const UNIT_TYPE_TENEMENT: UnitTypeDef = {
  id: 'tenement',
  label: 'Tenement / License',
  color: '#059669',
  icon: 'file-text',
  states: [
    { id: 'application', label: 'Application', severity: 'attention' },
    { id: 'granted', label: 'Granted', severity: 'nominal' },
    { id: 'renewal', label: 'Renewal Pending', severity: 'attention' },
    { id: 'suspended', label: 'Suspended', severity: 'blocked' },
    { id: 'expired', label: 'Expired', severity: 'blocked' },
  ],
  transitions: [
    { from: 'application', to: 'granted', label: 'Grant License', requiredEvidence: ['grant_notice'] },
    { from: 'granted', to: 'renewal', label: 'Renewal Due' },
    { from: 'renewal', to: 'granted', label: 'Renew', requiredEvidence: ['renewal_receipt'] },
    { from: 'granted', to: 'suspended', label: 'Suspend' },
    { from: 'suspended', to: 'granted', label: 'Reinstate' },
    { from: 'renewal', to: 'expired', label: 'Expire' },
  ],
  schema: [
    { key: 'license_id', label: 'License ID', type: 'string' },
    { key: 'area_ha', label: 'Area', type: 'number', unit: 'ha' },
    { key: 'holder', label: 'Holder', type: 'string' },
    { key: 'expiry_date', label: 'Expiry', type: 'date' },
  ],
  metrics: [
    { key: 'area_ha', label: 'Area', unit: 'ha' },
  ],
  inspectorSections: [
    { type: 'fields', label: 'License Details' },
    { type: 'children', label: 'Covered Deposits' },
    { type: 'graph', label: 'Dependencies' },
    { type: 'evidence', label: 'Documents' },
    { type: 'timeline', label: 'History' },
  ],
}

export const UNIT_TYPE_SPRING: UnitTypeDef = {
  id: 'spring',
  label: 'Spring',
  color: '#0EA5E9',
  icon: 'droplets',
  states: [
    { id: 'active', label: 'Active', severity: 'nominal' },
    { id: 'reduced', label: 'Reduced Flow', severity: 'attention' },
    { id: 'dry', label: 'Dry', severity: 'action_required' },
    { id: 'monitoring', label: 'Under Monitoring', severity: 'attention' },
  ],
  transitions: [
    { from: 'active', to: 'reduced', label: 'Flow Reduced', requiredEvidence: ['field_observation'] },
    { from: 'active', to: 'dry', label: 'Dried Up', requiredEvidence: ['field_observation'] },
    { from: 'reduced', to: 'active', label: 'Flow Restored' },
    { from: 'reduced', to: 'dry', label: 'Dried Up' },
    { from: 'dry', to: 'active', label: 'Flow Restored', requiredEvidence: ['field_observation'] },
    { from: 'active', to: 'monitoring', label: 'Flag for Monitoring' },
    { from: 'monitoring', to: 'active', label: 'Clear Monitoring' },
  ],
  schema: [
    { key: 'spring_id', label: 'Spring ID', type: 'string' },
    { key: 'coordinates', label: 'Location', type: 'coordinates' },
    { key: 'basin', label: 'Basin', type: 'string' },
  ],
  metrics: [],
  inspectorSections: [
    { type: 'fields', label: 'Location' },
    { type: 'telemetry', label: 'Flow Data' },
    { type: 'graph', label: 'Protected Area' },
    { type: 'evidence', label: 'Observations' },
    { type: 'timeline', label: 'History' },
  ],
}

export const UNIT_TYPE_PIEZOMETER: UnitTypeDef = {
  id: 'piezometer',
  label: 'Piezometer',
  color: '#2563EB',
  icon: 'gauge',
  states: [
    { id: 'online', label: 'Online', severity: 'nominal' },
    { id: 'warning', label: 'Warning', severity: 'attention' },
    { id: 'critical', label: 'Critical', severity: 'action_required' },
    { id: 'offline', label: 'Offline', severity: 'blocked' },
  ],
  transitions: [
    { from: 'online', to: 'warning', label: 'Threshold Warning' },
    { from: 'warning', to: 'critical', label: 'Escalate to Critical' },
    { from: 'warning', to: 'online', label: 'Recover' },
    { from: 'critical', to: 'warning', label: 'De-escalate' },
    { from: 'critical', to: 'online', label: 'Recover' },
    { from: 'online', to: 'offline', label: 'Take Offline' },
    { from: 'offline', to: 'online', label: 'Bring Online' },
  ],
  schema: [
    { key: 'sensor_id', label: 'Sensor ID', type: 'string' },
    { key: 'coordinates', label: 'Location', type: 'coordinates' },
    { key: 'depth_m', label: 'Installed Depth', type: 'number', unit: 'm' },
  ],
  metrics: [
    { key: 'depth_m', label: 'Water Level', unit: 'm' },
    { key: 'temperature_c', label: 'Temperature', unit: '°C' },
    { key: 'conductivity_us_cm', label: 'Conductivity', unit: 'μS/cm' },
  ],
  inspectorSections: [
    { type: 'fields', label: 'Sensor Info' },
    { type: 'telemetry', label: 'Live Readings' },
    { type: 'graph', label: 'Monitored Area' },
    { type: 'timeline', label: 'History' },
  ],
}

export const UNIT_TYPE_PLANT_NODE: UnitTypeDef = {
  id: 'plant_node',
  label: 'Plant / Infrastructure',
  color: '#8B5CF6',
  icon: 'factory',
  states: [
    { id: 'planned', label: 'Planned', severity: 'nominal' },
    { id: 'construction', label: 'Under Construction', severity: 'attention' },
    { id: 'operational', label: 'Operational', severity: 'nominal' },
    { id: 'maintenance', label: 'Maintenance', severity: 'attention' },
    { id: 'decommissioned', label: 'Decommissioned', severity: 'blocked' },
  ],
  transitions: [
    { from: 'planned', to: 'construction', label: 'Begin Construction' },
    { from: 'construction', to: 'operational', label: 'Commission' },
    { from: 'operational', to: 'maintenance', label: 'Maintenance Mode' },
    { from: 'maintenance', to: 'operational', label: 'Resume Operations' },
    { from: 'operational', to: 'decommissioned', label: 'Decommission' },
  ],
  schema: [
    { key: 'name', label: 'Name', type: 'string' },
    { key: 'node_type', label: 'Type', type: 'enum', enumValues: ['pilot_plant', 'commercial_plant', 'deposit_pit', 'urban_center'] },
    { key: 'coordinates', label: 'Location', type: 'coordinates' },
  ],
  metrics: [],
  inspectorSections: [
    { type: 'fields', label: 'Infrastructure' },
    { type: 'telemetry', label: 'Performance' },
    { type: 'graph', label: 'Connections' },
    { type: 'timeline', label: 'History' },
  ],
}

export const UNIT_TYPE_PROTECTED_AREA: UnitTypeDef = {
  id: 'protected_area',
  label: 'Protected Area',
  color: '#16A34A',
  icon: 'shield',
  states: [
    { id: 'active', label: 'Active Protection', severity: 'nominal' },
    { id: 'under_review', label: 'Under Review', severity: 'attention' },
    { id: 'modified', label: 'Modified Boundary', severity: 'attention' },
  ],
  transitions: [
    { from: 'active', to: 'under_review', label: 'Begin Review' },
    { from: 'under_review', to: 'active', label: 'Confirm Status' },
    { from: 'under_review', to: 'modified', label: 'Modify Boundary' },
    { from: 'modified', to: 'active', label: 'Ratify Changes' },
  ],
  schema: [
    { key: 'name', label: 'Area Name', type: 'string' },
    { key: 'designation', label: 'Designation', type: 'string' },
    { key: 'area_ha', label: 'Area', type: 'number', unit: 'ha' },
  ],
  metrics: [
    { key: 'area_ha', label: 'Area', unit: 'ha' },
  ],
  inspectorSections: [
    { type: 'fields', label: 'Details' },
    { type: 'children', label: 'Monitored Springs' },
    { type: 'evidence', label: 'Documents' },
    { type: 'timeline', label: 'History' },
  ],
}

export const UNIT_TYPE_BATCH: UnitTypeDef = {
  id: 'batch',
  label: 'Batch',
  color: '#F59E0B',
  icon: 'package',
  states: [
    { id: 'production', label: 'In Production', severity: 'nominal' },
    { id: 'qa', label: 'Quality Assurance', severity: 'attention' },
    { id: 'certified', label: 'Certified', severity: 'nominal' },
    { id: 'in_transit', label: 'In Transit', severity: 'nominal' },
    { id: 'delivered', label: 'Delivered', severity: 'nominal' },
    { id: 'rejected', label: 'Rejected', severity: 'action_required' },
  ],
  transitions: [
    { from: 'production', to: 'qa', label: 'Send to QA' },
    { from: 'qa', to: 'certified', label: 'Certify', requiredEvidence: ['xrf_analysis', 'certificate'] },
    { from: 'qa', to: 'rejected', label: 'Reject' },
    { from: 'certified', to: 'in_transit', label: 'Ship' },
    { from: 'in_transit', to: 'delivered', label: 'Confirm Delivery', requiredEvidence: ['delivery_receipt'] },
  ],
  schema: [
    { key: 'batch_id', label: 'Batch ID', type: 'string' },
    { key: 'tonnage_kg', label: 'Tonnage', type: 'number', unit: 'kg' },
    { key: 'feoc_percentage', label: 'FEOC %', type: 'number', unit: '%' },
    { key: 'ira_compliant', label: 'IRA Compliant', type: 'string' },
    { key: 'carbon_intensity', label: 'Carbon Intensity', type: 'number', unit: 'kg CO₂e/kg' },
    { key: 'destination', label: 'Destination', type: 'string' },
  ],
  metrics: [
    { key: 'tonnage_kg', label: 'Tonnage', unit: 'kg' },
    { key: 'carbon_intensity', label: 'CO₂ Intensity', unit: 'kg CO₂e/kg' },
  ],
  inspectorSections: [
    { type: 'fields', label: 'Batch Details' },
    { type: 'graph', label: 'Provenance' },
    { type: 'evidence', label: 'Certificates' },
    { type: 'timeline', label: 'Molecular Timeline' },
    { type: 'risks', label: 'Risks' },
  ],
}

export const UNIT_TYPE_PERMIT_CONDITION: UnitTypeDef = {
  id: 'permit_condition',
  label: 'Condition Precedent',
  color: '#DC2626',
  icon: 'check-circle',
  states: [
    { id: 'pending', label: 'Pending', severity: 'attention' },
    { id: 'in_progress', label: 'In Progress', severity: 'attention' },
    { id: 'met', label: 'Met', severity: 'nominal' },
    { id: 'waived', label: 'Waived', severity: 'nominal' },
    { id: 'failed', label: 'Failed', severity: 'blocked' },
  ],
  transitions: [
    { from: 'pending', to: 'in_progress', label: 'Begin Work' },
    { from: 'in_progress', to: 'met', label: 'Mark Met', requiredEvidence: ['completion_doc'] },
    { from: 'pending', to: 'waived', label: 'Waive' },
    { from: 'in_progress', to: 'failed', label: 'Mark Failed' },
  ],
  schema: [
    { key: 'cp_id', label: 'CP ID', type: 'string' },
    { key: 'description', label: 'Description', type: 'string' },
    { key: 'target_date', label: 'Target Date', type: 'date' },
  ],
  metrics: [],
  inspectorSections: [
    { type: 'fields', label: 'Condition' },
    { type: 'graph', label: 'Linked Milestones' },
    { type: 'evidence', label: 'Documents' },
    { type: 'timeline', label: 'History' },
  ],
}

export const UNIT_TYPE_REGULATORY_SUBMISSION: UnitTypeDef = {
  id: 'regulatory_submission',
  label: 'Regulatory Submission',
  color: '#7C3AED',
  icon: 'building',
  states: [
    { id: 'drafting', label: 'Drafting', severity: 'nominal' },
    { id: 'submitted', label: 'Submitted', severity: 'attention' },
    { id: 'in_review', label: 'In Review', severity: 'attention' },
    { id: 'approved', label: 'Approved', severity: 'nominal' },
    { id: 'rejected', label: 'Rejected', severity: 'action_required' },
    { id: 'pending', label: 'Pending', severity: 'attention' },
  ],
  transitions: [
    { from: 'drafting', to: 'submitted', label: 'Submit', requiredEvidence: ['submission_receipt'] },
    { from: 'submitted', to: 'in_review', label: 'Under Review' },
    { from: 'in_review', to: 'approved', label: 'Approve' },
    { from: 'in_review', to: 'rejected', label: 'Reject' },
    { from: 'rejected', to: 'drafting', label: 'Revise & Resubmit' },
    { from: 'pending', to: 'submitted', label: 'Submit' },
    { from: 'pending', to: 'in_review', label: 'Under Review' },
  ],
  schema: [
    { key: 'reg_id', label: 'Reg ID', type: 'string' },
    { key: 'body', label: 'Regulatory Body', type: 'string' },
    { key: 'type', label: 'Submission Type', type: 'string' },
    { key: 'date', label: 'Date', type: 'date' },
    { key: 'detail', label: 'Detail', type: 'string' },
  ],
  metrics: [],
  inspectorSections: [
    { type: 'fields', label: 'Submission Details' },
    { type: 'graph', label: 'Related Permits' },
    { type: 'evidence', label: 'Documents' },
    { type: 'timeline', label: 'History' },
  ],
}

export const UNIT_TYPE_RISK: UnitTypeDef = {
  id: 'risk',
  label: 'Risk',
  color: '#EF4444',
  icon: 'alert-triangle',
  states: [
    { id: 'open', label: 'Open', severity: 'action_required' },
    { id: 'mitigating', label: 'Mitigating', severity: 'attention' },
    { id: 'accepted', label: 'Accepted', severity: 'nominal' },
    { id: 'closed', label: 'Closed', severity: 'nominal' },
  ],
  transitions: [
    { from: 'open', to: 'mitigating', label: 'Begin Mitigation' },
    { from: 'mitigating', to: 'accepted', label: 'Accept Residual' },
    { from: 'mitigating', to: 'closed', label: 'Close Risk' },
    { from: 'open', to: 'accepted', label: 'Accept Risk' },
    { from: 'accepted', to: 'open', label: 'Re-open' },
  ],
  schema: [
    { key: 'risk_id', label: 'Risk ID', type: 'string' },
    { key: 'title', label: 'Title', type: 'string' },
    { key: 'category', label: 'Category', type: 'enum', enumValues: ['permitting', 'market', 'geopolitical', 'technical', 'environmental', 'operational'] },
    { key: 'likelihood', label: 'Likelihood', type: 'number' },
    { key: 'impact', label: 'Impact', type: 'number' },
    { key: 'score', label: 'Score', type: 'number' },
    { key: 'mitigation', label: 'Mitigation', type: 'string' },
    { key: 'owner', label: 'Owner', type: 'string' },
  ],
  metrics: [
    { key: 'score', label: 'Risk Score', unit: '' },
  ],
  inspectorSections: [
    { type: 'fields', label: 'Risk Details' },
    { type: 'graph', label: 'Affected Units' },
    { type: 'evidence', label: 'Evidence' },
    { type: 'timeline', label: 'History' },
  ],
}

export const UNIT_TYPE_INCIDENT: UnitTypeDef = {
  id: 'incident',
  label: 'Incident',
  color: '#F97316',
  icon: 'zap',
  states: [
    { id: 'triggered', label: 'Triggered', severity: 'action_required' },
    { id: 'acknowledged', label: 'Acknowledged', severity: 'attention' },
    { id: 'resolved', label: 'Resolved', severity: 'nominal' },
  ],
  transitions: [
    { from: 'triggered', to: 'acknowledged', label: 'Acknowledge' },
    { from: 'acknowledged', to: 'resolved', label: 'Resolve', requiredEvidence: ['resolution_note'] },
  ],
  schema: [
    { key: 'incident_id', label: 'Incident ID', type: 'string' },
    { key: 'title', label: 'Title', type: 'string' },
    { key: 'severity', label: 'Severity', type: 'enum', enumValues: ['warning', 'critical'] },
    { key: 'triggered_at', label: 'Triggered', type: 'date' },
    { key: 'assignee', label: 'Assignee', type: 'string' },
    { key: 'sla_minutes', label: 'SLA', type: 'number', unit: 'min' },
  ],
  metrics: [
    { key: 'sla_minutes', label: 'SLA', unit: 'min' },
  ],
  inspectorSections: [
    { type: 'fields', label: 'Incident Details' },
    { type: 'graph', label: 'Related Alerts' },
    { type: 'evidence', label: 'Evidence' },
    { type: 'timeline', label: 'Timeline' },
  ],
}

export const UNIT_TYPE_OFFTAKE: UnitTypeDef = {
  id: 'offtake',
  label: 'Offtake Agreement',
  color: '#10B981',
  icon: 'handshake',
  states: [
    { id: 'prospect', label: 'Prospect', severity: 'nominal' },
    { id: 'loi', label: 'LOI Signed', severity: 'attention' },
    { id: 'binding', label: 'Binding Agreement', severity: 'nominal' },
    { id: 'delivering', label: 'Delivering', severity: 'nominal' },
    { id: 'completed', label: 'Completed', severity: 'nominal' },
  ],
  transitions: [
    { from: 'prospect', to: 'loi', label: 'Sign LOI' },
    { from: 'loi', to: 'binding', label: 'Execute Agreement', requiredEvidence: ['signed_agreement'] },
    { from: 'binding', to: 'delivering', label: 'Begin Deliveries' },
    { from: 'delivering', to: 'completed', label: 'Complete Contract' },
  ],
  schema: [
    { key: 'offtaker_name', label: 'Offtaker', type: 'string' },
    { key: 'location', label: 'Location', type: 'string' },
    { key: 'volume_commitment', label: 'Volume', type: 'string' },
    { key: 'product', label: 'Product', type: 'string' },
    { key: 'delivery_schedule', label: 'Delivery', type: 'string' },
  ],
  metrics: [],
  inspectorSections: [
    { type: 'fields', label: 'Agreement Details' },
    { type: 'graph', label: 'Linked Batches' },
    { type: 'evidence', label: 'Documents' },
    { type: 'timeline', label: 'History' },
  ],
}

export const UNIT_TYPE_MILESTONE: UnitTypeDef = {
  id: 'milestone',
  label: 'Milestone',
  color: '#6D28D9',
  icon: 'flag',
  states: [
    { id: 'pending', label: 'Pending', severity: 'nominal' },
    { id: 'in_progress', label: 'In Progress', severity: 'attention' },
    { id: 'on_track', label: 'On Track', severity: 'nominal' },
    { id: 'at_risk', label: 'At Risk', severity: 'action_required' },
    { id: 'completed', label: 'Completed', severity: 'nominal' },
    { id: 'missed', label: 'Missed', severity: 'blocked' },
  ],
  transitions: [
    { from: 'pending', to: 'in_progress', label: 'Start' },
    { from: 'in_progress', to: 'on_track', label: 'Mark On Track' },
    { from: 'in_progress', to: 'at_risk', label: 'Flag At Risk' },
    { from: 'on_track', to: 'at_risk', label: 'Flag At Risk' },
    { from: 'at_risk', to: 'on_track', label: 'Recover' },
    { from: 'on_track', to: 'completed', label: 'Complete' },
    { from: 'in_progress', to: 'completed', label: 'Complete' },
    { from: 'at_risk', to: 'completed', label: 'Complete' },
    { from: 'at_risk', to: 'missed', label: 'Mark Missed' },
  ],
  schema: [
    { key: 'name', label: 'Milestone', type: 'string' },
    { key: 'target_date', label: 'Target Date', type: 'date' },
    { key: 'lead', label: 'Lead', type: 'string' },
    { key: 'progress_pct', label: 'Progress', type: 'number', unit: '%' },
  ],
  metrics: [
    { key: 'progress_pct', label: 'Progress', unit: '%' },
  ],
  inspectorSections: [
    { type: 'fields', label: 'Milestone Details' },
    { type: 'graph', label: 'Dependencies' },
    { type: 'evidence', label: 'Evidence' },
    { type: 'timeline', label: 'History' },
  ],
}

/* ─── Maritime instance types ─────────────────────────────────────────────── */
/**
 * Unit types for the Atlantic Maritime Authority demo instance. They reuse
 * the same UnitTypeDef shape as the Caldeira mining types so the existing
 * unit graph engine (states, transitions, evidence, audit) handles them
 * with no new machinery — only seed data.
 */

export const UNIT_TYPE_MARITIME_AOI: UnitTypeDef = {
  id: 'maritime_aoi',
  label: 'Area of Interest',
  color: '#06B6D4',
  icon: 'shield',
  states: [
    { id: 'patrolling', label: 'Active Patrol', severity: 'nominal' },
    { id: 'restricted', label: 'Restricted Zone', severity: 'attention' },
    { id: 'commercial', label: 'Commercial Lane', severity: 'nominal' },
    { id: 'environmental', label: 'Environmental Zone', severity: 'nominal' },
    { id: 'standdown', label: 'Stand-Down', severity: 'attention' },
  ],
  transitions: [
    { from: 'patrolling', to: 'standdown', label: 'Stand Down' },
    { from: 'standdown', to: 'patrolling', label: 'Resume Patrol' },
  ],
  schema: [
    { key: 'aoi_id', label: 'AOI ID', type: 'string' },
    { key: 'classification', label: 'Classification', type: 'enum', enumValues: ['patrol', 'restricted', 'commercial_lane', 'environmental'] },
    { key: 'description', label: 'Description', type: 'string' },
    { key: 'assigned_assets', label: 'Assigned Assets', type: 'string' },
    { key: 'center', label: 'Center', type: 'coordinates' },
  ],
  metrics: [],
  inspectorSections: [
    { type: 'fields', label: 'AOI Details' },
    { type: 'children', label: 'Vessels in AOI' },
    { type: 'graph', label: 'Linked Sensors' },
    { type: 'evidence', label: 'ISR Products' },
    { type: 'timeline', label: 'Activity' },
  ],
}

export const UNIT_TYPE_VESSEL: UnitTypeDef = {
  id: 'vessel',
  label: 'Vessel',
  color: '#38BDF8',
  icon: 'ship',
  states: [
    { id: 'tracked', label: 'Tracked (AIS)', severity: 'nominal' },
    { id: 'dark', label: 'Dark / AIS Lost', severity: 'action_required' },
    { id: 'inspected', label: 'Inspected', severity: 'attention' },
    { id: 'cleared', label: 'Cleared', severity: 'nominal' },
    { id: 'detained', label: 'Detained', severity: 'blocked' },
  ],
  transitions: [
    { from: 'tracked', to: 'dark', label: 'Flag Dark' },
    { from: 'dark', to: 'inspected', label: 'Tasked for Inspection', requiredEvidence: ['isr_product'] },
    { from: 'inspected', to: 'cleared', label: 'Clear' },
    { from: 'inspected', to: 'detained', label: 'Detain' },
    { from: 'dark', to: 'tracked', label: 'AIS Re-Acquired' },
  ],
  schema: [
    { key: 'mmsi', label: 'MMSI', type: 'string' },
    { key: 'name', label: 'Vessel Name', type: 'string' },
    { key: 'flag', label: 'Flag', type: 'string' },
    { key: 'vessel_type', label: 'Type', type: 'enum', enumValues: ['cargo', 'tanker', 'fishing', 'passenger', 'patrol', 'unknown'] },
    { key: 'loa_m', label: 'Length Overall', type: 'number', unit: 'm' },
    { key: 'coordinates', label: 'Last Known Position', type: 'coordinates' },
  ],
  metrics: [
    { key: 'loa_m', label: 'LOA', unit: 'm' },
  ],
  inspectorSections: [
    { type: 'fields', label: 'Vessel Particulars' },
    { type: 'telemetry', label: 'Track' },
    { type: 'graph', label: 'AOIs / Sensors' },
    { type: 'evidence', label: 'Detections' },
    { type: 'timeline', label: 'Activity' },
  ],
}

export const UNIT_TYPE_SENSOR_STATION: UnitTypeDef = {
  id: 'sensor_station',
  label: 'Sensor Station',
  color: '#A78BFA',
  icon: 'radio',
  states: [
    { id: 'nominal', label: 'Nominal', severity: 'nominal' },
    { id: 'degraded', label: 'Degraded', severity: 'attention' },
    { id: 'offline', label: 'Offline', severity: 'blocked' },
  ],
  transitions: [
    { from: 'nominal', to: 'degraded', label: 'Degrade' },
    { from: 'degraded', to: 'nominal', label: 'Restore' },
    { from: 'degraded', to: 'offline', label: 'Take Offline' },
    { from: 'offline', to: 'nominal', label: 'Bring Online' },
  ],
  schema: [
    { key: 'station_id', label: 'Station ID', type: 'string' },
    { key: 'kind', label: 'Sensor Kind', type: 'enum', enumValues: ['shore_radar', 'satellite_pass', 'drone_orbit'] },
    { key: 'range_km', label: 'Range', type: 'number', unit: 'km' },
    { key: 'detail', label: 'Detail', type: 'string' },
    { key: 'coordinates', label: 'Anchor Point', type: 'coordinates' },
  ],
  metrics: [
    { key: 'range_km', label: 'Coverage Radius', unit: 'km' },
  ],
  inspectorSections: [
    { type: 'fields', label: 'Sensor Info' },
    { type: 'graph', label: 'Covered AOIs' },
    { type: 'telemetry', label: 'Detections' },
    { type: 'timeline', label: 'Health' },
  ],
}

export const UNIT_TYPE_ISR_PRODUCT: UnitTypeDef = {
  id: 'isr_product',
  label: 'ISR Product',
  color: '#22D3EE',
  icon: 'file-text',
  states: [
    { id: 'drafting', label: 'Drafting', severity: 'attention' },
    { id: 'ready', label: 'Ready for Handoff', severity: 'nominal' },
    { id: 'handed_off', label: 'Handed Off', severity: 'nominal' },
  ],
  transitions: [
    { from: 'drafting', to: 'ready', label: 'Mark Ready', requiredEvidence: ['isr_attachment'] },
    { from: 'ready', to: 'handed_off', label: 'Hand Off', requiredEvidence: ['handoff_receipt'] },
  ],
  schema: [
    { key: 'product_id', label: 'Product ID', type: 'string' },
    { key: 'subject', label: 'Subject', type: 'string' },
    { key: 'classification_marking', label: 'Marking', type: 'string' },
    { key: 'authored_by', label: 'Author', type: 'string' },
    { key: 'authored_at', label: 'Authored', type: 'date' },
  ],
  metrics: [],
  inspectorSections: [
    { type: 'fields', label: 'Product Details' },
    { type: 'graph', label: 'Linked Vessels / AOIs' },
    { type: 'evidence', label: 'Attachments' },
    { type: 'timeline', label: 'Handoff Chain' },
  ],
}

export const UNIT_TYPE_INCIDENT_ALERT: UnitTypeDef = {
  id: 'incident_alert',
  label: 'Incident Alert',
  color: '#F43F5E',
  icon: 'alert-triangle',
  states: [
    { id: 'open', label: 'Open', severity: 'action_required' },
    { id: 'investigating', label: 'Investigating', severity: 'attention' },
    { id: 'resolved', label: 'Resolved', severity: 'nominal' },
    { id: 'false_positive', label: 'False Positive', severity: 'nominal' },
  ],
  transitions: [
    { from: 'open', to: 'investigating', label: 'Acknowledge' },
    { from: 'investigating', to: 'resolved', label: 'Resolve', requiredEvidence: ['resolution_note'] },
    { from: 'investigating', to: 'false_positive', label: 'Mark False Positive' },
  ],
  schema: [
    { key: 'alert_id', label: 'Alert ID', type: 'string' },
    { key: 'title', label: 'Title', type: 'string' },
    { key: 'severity', label: 'Severity', type: 'enum', enumValues: ['attention', 'action_required', 'blocked'] },
    { key: 'detected_at', label: 'Detected', type: 'date' },
    { key: 'aoi_id', label: 'AOI', type: 'string' },
    { key: 'vessel_id', label: 'Vessel', type: 'string' },
    { key: 'coordinates', label: 'Location', type: 'coordinates' },
  ],
  metrics: [],
  inspectorSections: [
    { type: 'fields', label: 'Alert Details' },
    { type: 'graph', label: 'Linked Vessel / AOI' },
    { type: 'evidence', label: 'Evidence' },
    { type: 'timeline', label: 'Response Timeline' },
  ],
}

/** All 20 unit type definitions in seed order. */
export const ALL_UNIT_TYPES: UnitTypeDef[] = [
  UNIT_TYPE_SITE,
  UNIT_TYPE_DEPOSIT,
  UNIT_TYPE_DRILLHOLE,
  UNIT_TYPE_TENEMENT,
  UNIT_TYPE_SPRING,
  UNIT_TYPE_PIEZOMETER,
  UNIT_TYPE_PLANT_NODE,
  UNIT_TYPE_PROTECTED_AREA,
  UNIT_TYPE_BATCH,
  UNIT_TYPE_PERMIT_CONDITION,
  UNIT_TYPE_REGULATORY_SUBMISSION,
  UNIT_TYPE_RISK,
  UNIT_TYPE_INCIDENT,
  UNIT_TYPE_OFFTAKE,
  UNIT_TYPE_MILESTONE,
  UNIT_TYPE_MARITIME_AOI,
  UNIT_TYPE_VESSEL,
  UNIT_TYPE_SENSOR_STATION,
  UNIT_TYPE_ISR_PRODUCT,
  UNIT_TYPE_INCIDENT_ALERT,
]
