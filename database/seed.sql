-- ==============================================================================
-- OpsDesk - Multi-Department Ticketing & Operations Portal
-- Seed Data for MySQL 8.0+
-- ==============================================================================

-- 1. Departments
INSERT INTO `departments` (`id`, `code`, `name`, `description`, `is_primary`, `status`) VALUES
('dept_surveillance', 'SURV', 'Surveillance Operations & Surveillance', 'Centralized 24/7 surveillance monitoring, CCTV telemetry, dispatch, and physical security management.', 1, 'active'),
('dept_security', 'SEC', 'Security Operations', 'Physical access control, perimeter guard dispatch, emergency protocol execution, and site incidents.', 0, 'active'),
('dept_admin', 'ADMIN', 'Administration & Governance', 'Corporate facility governance, policy enforcement, executive auditing, and store operations.', 0, 'active'),
('dept_hvac', 'HVAC', 'HVAC & Climate Control', 'Heating, ventilation, air conditioning diagnostics, chilled water lines, thermostat telemetry, and preventive maintenance.', 0, 'active')
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

-- 2. Regions
INSERT INTO `regions` (`id`, `name`, `code`, `status`) VALUES
('reg_central', 'Central Region', 'CENTRAL', 'ACTIVE'),
('reg_hq', 'Headquarters Region', 'HQ', 'ACTIVE'),
('reg_cafe', 'Ideas Cafe Region', 'CAFE', 'ACTIVE'),
('reg_north', 'North Region', 'NORTH', 'ACTIVE'),
('reg_south', 'South Region', 'SOUTH', 'ACTIVE')
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

-- 3. SLA Rules
INSERT INTO `sla_rules` (`id`, `priority_tier`, `category_domain`, `department`, `response_sla_minutes`, `resolution_sla_hours`, `escalation_trigger_hours`, `status`) VALUES
('sla_crit', 'CRITICAL', 'Hardware / Camera', 'Surveillance Operations', 15, 2, 1, 'Active'),
('sla_high', 'HIGH', 'Network / Connectivity', 'IT Infrastructure', 30, 4, 3, 'Active'),
('sla_med', 'MEDIUM', 'Access Control', 'Security Management', 120, 24, 18, 'Active'),
('sla_low', 'LOW', 'General Inquiry', 'General Operations', 480, 72, 60, 'Active')
ON DUPLICATE KEY UPDATE `category_domain`=VALUES(`category_domain`);

-- 4. Initial Users (Master Credentials: admin@ideas.com.pk / @dm!n#+390++--)
INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `department_id`, `department_name`, `role`, `status`, `avatar_initials`, `workload_status`, `granular_rights`) VALUES
('admin-super', 'Super Admin', 'admin@ideas.com.pk', '@dm!n#+390++--', 'dept_surveillance', 'Security Operations & Surveillance', 'SUPER_ADMIN', 'Active', 'AD', 'Idle', '["Tickets", "Resolve", "Live Feeds", "Users", "Settings", "Audit", "Delete"]'),
('admin-surveillance', 'Surveillance Super Admin', 'admin.surveillance@ideas.com.pk', '@dm!n#+390++--', 'dept_surveillance', 'Security Operations & Surveillance', 'SUPER_ADMIN', 'Active', 'SA', 'Idle', '["Tickets", "Resolve", "Live Feeds", "Users", "Settings", "Audit", "Delete"]'),
('admin-general', 'Administrator', 'administrator@ideas.com.pk', '@dm!n#+390++--', 'dept_admin', 'Administration & Governance', 'SUPER_ADMIN', 'Active', 'AD', 'Idle', '["Tickets", "Resolve", "Live Feeds", "Users", "Settings"]'),
('sec-lead', 'Security Supervisor Lead', 'supervisor.security@ideas.com.pk', '@dm!n#+390++--', 'dept_security', 'Security Operations & Surveillance', 'SUPERVISOR', 'Active', 'SE', 'Idle', '["Tickets", "Resolve", "Live Feeds", "Assign"]'),
('ops-sup', 'Operations Supervisor', 'supervisor.ops@ideas.com.pk', '@dm!n#+390++--', 'dept_surveillance', 'Security Operations & Surveillance', 'SUPERVISOR', 'Active', 'OP', 'Idle', '["Tickets", "Resolve", "Live Feeds", "Assign"]'),
('sup-three', 'Supervisor Three', 'supervisor3@ideas.com.pk', '@dm!n#+390++--', 'dept_surveillance', 'Security Operations & Surveillance', 'SUPERVISOR', 'Active', 'SU', 'Idle', '["Tickets", "Resolve"]'),
('sup-test', 'Supervisor Test', 'supervisor.test@ideas.com.pk', '@dm!n#+390++--', 'dept_surveillance', 'Security Operations & Surveillance', 'SUPERVISOR', 'Active', 'SU', 'Idle', '["Tickets", "Resolve"]'),
('tech-hvac', 'HVAC Field Specialist', 'hvac.tech@ideas.com.pk', '@dm!n#+390++--', 'dept_hvac', 'HVAC & Climate Control', 'TECHNICIAN', 'Active', 'HV', 'Idle', '["Tickets", "Resolve"]')
ON DUPLICATE KEY UPDATE `password_hash`=VALUES(`password_hash`), `name`=VALUES(`name`);

-- 5. Locations (Representative sample + all regions populated)
INSERT INTO `locations` (`id`, `branch_code`, `name`, `region_id`, `region_name`, `physical_address`, `contact_person`, `phone`, `notification_email`, `camera_zones`, `areas_details`, `status`) VALUES
('loc_001', 'AG001', 'Agency Jaranwala', 'reg_central', 'Central', 'Circular Road, Near City Chowk, Jaranwala', 'Muhammad Tariq', '+92 300 1234567', 'agency.jaranwala@ideas.com.pk', 1, 'Main Showroom', 'Active'),
('loc_002', 'AG002', 'Agency Quetta', 'reg_south', 'South', 'Liaquat Bazaar, Opposite GPO, Quetta', 'Rehmat Khan', '+92 333 7654321', 'agency.quetta@ideas.com.pk', 1, 'Main Showroom', 'Active'),
('loc_003', 'CF001', 'Cafe DMC', 'reg_cafe', 'Ideas Cafe', 'DMC Campus Concourse, Karachi', 'Chef Farhan', '+92 321 9876543', 'cafe.dmc@ideas.com.pk', 1, 'Kitchen & Dining Lounge', 'Active'),
('loc_004', 'CF002', 'Cafe Shahbaz', 'reg_cafe', 'Ideas Cafe', 'Shahbaz Commercial Area, Phase 6 DHA, Karachi', 'Adnan Siddiqui', '+92 345 1122334', 'cafe.shahbaz@ideas.com.pk', 1, 'Espresso Bar & Terrace', 'Active'),
('loc_005', 'FB001', 'Fabric Store Burewala', 'reg_central', 'Central', 'Multan Road, Main Commercial Market, Burewala', 'Nasir Mehmood', '+92 301 4455667', 'fabric.burewala@ideas.com.pk', 1, 'Ground Floor Retail', 'Active'),
('loc_006', 'FB002', 'Fabric Store Chakwal', 'reg_north', 'North', 'Talagang Road, Near Hospital Square, Chakwal', 'Khurram Shehzad', '+92 312 8899001', 'fabric.chakwal@ideas.com.pk', 1, 'Retail Store & Storage', 'Active'),
('loc_007', 'HQ001', 'Corporate Headquarters', 'reg_hq', 'Headquarters', 'Plot 43-A, Industrial Area, Sector 15 Korangi, Karachi', 'Zainab Qureshi', '+92 21 111-433-271', 'hq.ops@ideas.com.pk', 12, 'Operations NOC & Server Room', 'Active'),
('loc_008', 'ST001', 'Gulberg Galleria Outlet', 'reg_central', 'Central', 'Main Boulevard, Gulberg III, Lahore', 'Asad Ali', '+92 42 35750001', 'store.gulberg@ideas.com.pk', 4, 'Level 1 & Basement', 'Active'),
('loc_009', 'ST002', 'Centaurus Mall Store', 'reg_north', 'North', '1st Floor The Centaurus, Jinnah Avenue, Islamabad', 'Bilal Ahmed', '+92 51 2604000', 'store.centaurus@ideas.com.pk', 3, 'Showroom Floor', 'Active'),
('loc_010', 'ST003', 'Dolmen Mall Clifton', 'reg_south', 'South', 'Sea View Road, Block 4 Clifton, Karachi', 'Sana Mir', '+92 21 35293000', 'store.dolmen@ideas.com.pk', 5, 'Main Atrium Unit', 'Active')
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

-- 6. Initial Seed Ticket (CMP-2026-531656)
INSERT INTO `tickets` (`id`, `ticket_number`, `subject`, `description`, `department_id`, `department_name`, `category`, `priority`, `status`, `assigned_technician_id`, `assigned_technician_name`, `location_id`, `location_name`, `region_name`, `sla_deadline`, `sla_status`, `sla_remaining_hours`, `created_by_user_id`, `created_by_name`) VALUES
('ticket_531656', 'CMP-2026-531656', 'TEST1', 'Camera feed intermittent dropout during high-load periods. Physical inspection of switch port and cable termination required.', 'dept_surveillance', 'Security Operations & Surveillance', 'GENERAL', 'MEDIUM', 'NEW', NULL, 'Unassigned', 'loc_001', 'Agency Jaranwala', 'Central', DATE_ADD(NOW(), INTERVAL 21 HOUR), 'ON TRACK', 21.2, 'admin-surveillance', 'Surveillance Super Admin')
ON DUPLICATE KEY UPDATE `subject`=VALUES(`subject`);

-- 7. Initial Audit Trail Logs
INSERT INTO `audit_logs` (`id`, `timestamp`, `scope_category`, `administrator`, `user_id`, `user_role`, `setting_changed`, `target_entity`, `action_code`, `action_narrative`, `previous_value`, `new_value`, `ip_session`, `raw_json`) VALUES
('id-1790504928808-r9kfg', '2026-09-27 15:28:48', 'Ticket Ops', 'Surveillance Super Admin', 'admin-surveillance', 'SUPER_ADMIN', 'Ticket #CMP-2026-531656 Creation', 'Ticket #CMP-2026-531656 Creation', 'TICKET_CREATED', 'Created observation incident #CMP-2026-531656: "TEST1" [Priority: MEDIUM]', '— No previous value recorded / Newly initialized —', 'Priority: MEDIUM | Loc: Agency Jaranwala', '127.0.0.1 (Authenticated Session)', '{"action":"TICKET_CREATED","ticketNumber":"CMP-2026-531656","priority":"MEDIUM","location":"Agency Jaranwala"}'),
('id-1790504928807-g4p11', '2026-09-27 15:22:03', 'User Governance', 'admin.surveillance@ideas.com.pk', 'admin-surveillance', 'SUPER_ADMIN', 'system_configuration', 'System Configuration', 'CONFIG_SAVED', 'Updated branding settings and visual studio parameters.', '—', '—', '182.189.96.202', '{"action":"CONFIG_SAVED","module":"Visual Studio"}'),
('id-1790504928806-k8m92', '2026-09-27 05:21:44', 'User Governance', 'admin@ideas.com.pk', 'admin-super', 'SUPER_ADMIN', 'System Setting', 'System Governance', 'DB_SYNCED', 'Hostinger MySQL database schema synchronization executed successfully.', '—', '—', '182.189.96.202', '{"action":"DB_SYNCED","status":"ONLINE"}'),
('id-1790504928805-j3b44', '2026-09-27 04:38:07', 'User Governance', 'Surveillance Super Admin', 'admin-surveillance', 'SUPER_ADMIN', 'User Account: admin@ideas.com.pk', 'User Account: admin@ideas.com.pk', 'ROLE_ASSIGNED', 'Assigned role SUPER_ADMIN to user admin@ideas.com.pk', '—', 'Role: SUPER_ADMIN', '127.0.0.1 (Authenticated Session)', '{"action":"ROLE_ASSIGNED","role":"SUPER_ADMIN"}')
ON DUPLICATE KEY UPDATE `action_code`=VALUES(`action_code`);

-- 8. System Settings
INSERT INTO `system_settings` (`setting_key`, `setting_value`, `updated_by`) VALUES
('general', '{"appName":"ideas - Surveillance Operations Command System","maintenanceMode":false,"slaEngineEnabled":true,"maxPictureSizeMb":2,"autoCompress":true,"strictToastWarning":true}', 'Surveillance Super Admin'),
('smtp', '{"fromEmail":"cctv.alert@ideas.com.pk","smtpHost":"smtp.office365.com","smtpPort":587,"smtpUser":"cctv.alert@ideas.com.pk"}', 'Surveillance Super Admin'),
('branding', '{"heroTitle":"Surveillance Operations","heroSubtitle":"Monitor. Detect. Respond. Keep Your Environment Safe.","subtextDescription":"Centralized CCTV health telemetry, real-time ticket escalation, and multi-department facility security operations.","badgeText":"SURVEILLANCE OPERATIONS","heroHeight":44,"formHeight":44,"sidebarHeight":36}', 'Surveillance Super Admin'),
('rbac', '{"rbacEnabled":true,"matrix":{"Can Create Tickets":{"SUPER_ADMIN":true,"SUPERVISOR":true,"OPERATOR":true,"TECHNICIAN":true},"Can Resolve Tickets":{"SUPER_ADMIN":true,"SUPERVISOR":true,"OPERATOR":true,"TECHNICIAN":true},"Can Assign Tickets":{"SUPER_ADMIN":true,"SUPERVISOR":true,"OPERATOR":false,"TECHNICIAN":false},"Can Comment":{"SUPER_ADMIN":true,"SUPERVISOR":true,"OPERATOR":true,"TECHNICIAN":true},"Can Delete Tickets":{"SUPER_ADMIN":true,"SUPERVISOR":true,"OPERATOR":false,"TECHNICIAN":false},"Can View Live Feeds":{"SUPER_ADMIN":true,"SUPERVISOR":true,"OPERATOR":true,"TECHNICIAN":true},"Can Flag Security":{"SUPER_ADMIN":true,"SUPERVISOR":true,"OPERATOR":false,"TECHNICIAN":false},"Can Manage Users":{"SUPER_ADMIN":true,"SUPERVISOR":true,"OPERATOR":false,"TECHNICIAN":false},"Can Export Reports":{"SUPER_ADMIN":true,"SUPERVISOR":true,"OPERATOR":false,"TECHNICIAN":false},"Can Manage System":{"SUPER_ADMIN":true,"SUPERVISOR":true,"OPERATOR":false,"TECHNICIAN":false}}}', 'Surveillance Super Admin')
ON DUPLICATE KEY UPDATE `setting_value`=VALUES(`setting_value`);
