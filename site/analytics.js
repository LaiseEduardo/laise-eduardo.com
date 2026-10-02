// PostHog product analytics. The project token is public by design (write-only ingestion key).
const POSTHOG_TOKEN = 'phc_vgHSWgwzM4bzDXCJvDQvaU8W8ofRsqutyVthB82pQSJ7';
const POSTHOG_HOST = 'https://eu.i.posthog.com';

const local = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);

if (!local && !POSTHOG_TOKEN.startsWith('REPLACE')) {
  // Official posthog-js loader snippet (EU assets host).
  !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);

  posthog.init(POSTHOG_TOKEN, {
    api_host: POSTHOG_HOST,
    defaults: '2025-05-24',
    person_profiles: 'identified_only',
  });

  // Meaningful actions only; pageviews are captured automatically.
  const events = [
    ['a[download]', 'cv_downloaded'],
    ['a[href^="mailto:"]', 'email_clicked'],
    ['a[href*="github.com"]', 'github_clicked'],
    ['a[href*="linkedin.com"]', 'linkedin_clicked'],
    ['.detail-links a', 'project_link_clicked'],
  ];
  document.addEventListener('click', e => {
    const a = e.target.closest('a');
    if (!a) return;
    const hit = events.find(([sel]) => a.matches(sel));
    if (!hit) return;
    posthog.capture(hit[1], {
      label: a.textContent.trim(),
      href: a.getAttribute('href'),
      project: a.closest('.detail')?.querySelector('h3')?.textContent ?? undefined,
    });
  });

  window.addEventListener('error', e => posthog.captureException(e.error ?? new Error(e.message)));
}
