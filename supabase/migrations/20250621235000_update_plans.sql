
-- Atualizar planos para incluir Golfinho e Tubarão
DELETE FROM public.plans;

INSERT INTO public.plans (name, monthly_price, tracking_limit, can_customize_logo, can_customize_tone, can_edit_messages, can_use_subdomain, can_use_custom_domain, can_use_order_bump, can_send_email_automation, can_send_whatsapp_automation) VALUES
('Peixe', 49.90, 60, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE),
('Polvo', 97.00, 200, TRUE, TRUE, FALSE, FALSE, FALSE, TRUE, TRUE, FALSE),
('Golfinho', 197.00, 500, TRUE, TRUE, TRUE, TRUE, FALSE, TRUE, TRUE, FALSE),
('Tubarão', 397.00, NULL, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE);
