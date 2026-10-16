/**
 * Enterprise HTML Email Report Generator & Dispatch Engine
 * Formats rich, responsive executive summary cards for leadership & stakeholders.
 */

function generateExecutiveEmailHtml(data) {
  const isPassed = data.exitCode === 0;
  const passCount = data.stats?.passed || 0;
  const failCount = data.stats?.failed || 0;
  const total = Math.max(data.stats?.total || passCount + failCount, 1);
  const passRate = Math.round((passCount / total) * 100);
  const durationSec = data.duration ? (data.duration / 1000).toFixed(1) + 's' : '0.0s';
  const serverHost = data.serverHost || 'localhost:3030';
  const reportUrl = `http://${serverHost}/reports/html/index.html`;
  const dashboardUrl = `http://${serverHost}`;

  const statusColor = isPassed ? '#10b981' : '#ef4444';
  const statusBg = isPassed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)';
  const statusBorder = isPassed ? '#10b981' : '#ef4444';
  const statusText = isPassed ? 'PASSED / RELEASE READY' : 'FAILED / ATTENTION REQUIRED';
  const statusIcon = isPassed ? '✅' : '🚨';

  let rcaSectionHtml = '';
  if (!isPassed && data.rca) {
    const remediationList = (data.rca.suggestedRemediation || [])
      .map(r => `<li style="margin-bottom: 4px; color: #475569;">${r}</li>`)
      .join('');

    rcaSectionHtml = `
      <div style="margin-top: 24px; padding: 18px; background-color: #fff1f2; border: 1px solid #fecdd3; border-left: 4px solid #ef4444; border-radius: 8px;">
        <div style="font-size: 14px; font-weight: 700; color: #9f1239; margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
          <span>🤖</span> AI Root-Cause Diagnostic & Remediation
        </div>
        <div style="font-size: 13px; color: #881337; margin-bottom: 8px;">
          <strong>Impacted Step:</strong> ${data.rca.failingStep || 'Step Execution'}
        </div>
        <div style="font-size: 13px; color: #334155; line-height: 1.5; margin-bottom: 12px;">
          ${data.rca.summary || data.rca.rootCause || 'Test failure recorded during execution.'}
        </div>
        ${remediationList ? `<ul style="margin: 0; padding-left: 20px; font-size: 12px;">${remediationList}</ul>` : ''}
      </div>
    `;
  }

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>IoT Hub Test Execution Summary</title>
</head>
<body style="margin: 0; padding: 24px 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 620px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
    
    <!-- Top Header -->
    <tr>
      <td style="padding: 24px 30px; background-color: #0b1329; border-bottom: 2px solid #0066ff;">
        <table width="100%" border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td>
              <span style="color: #ffffff; font-size: 18px; font-weight: 800; letter-spacing: -0.5px;">IoT <span style="color: #60a5fa; font-weight: 400;">HUB Automation</span></span>
            </td>
            <td align="right">
              <span style="font-size: 11px; font-weight: 700; color: #93c5fd; background-color: rgba(0, 102, 255, 0.25); border: 1px solid rgba(0, 102, 255, 0.4); padding: 4px 10px; border-radius: 6px; text-transform: uppercase;">Executive Summary</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Status Banner -->
    <tr>
      <td style="padding: 24px 30px 16px;">
        <div style="background-color: ${statusBg}; border: 1px solid ${statusBorder}; padding: 14px 18px; border-radius: 8px; display: flex; align-items: center; justify-content: space-between;">
          <table width="100%" border="0" cellpadding="0" cellspacing="0">
            <tr>
              <td>
                <span style="font-size: 20px; margin-right: 8px;">${statusIcon}</span>
                <strong style="font-size: 15px; color: ${statusColor};">${statusText}</strong>
              </td>
              <td align="right">
                <span style="font-size: 12px; color: #64748b; font-family: monospace;">${data.runId}</span>
              </td>
            </tr>
          </table>
        </div>
      </td>
    </tr>

    <!-- Target & Environment Details -->
    <tr>
      <td style="padding: 0 30px 20px;">
        <h2 style="margin: 0 0 4px; font-size: 18px; font-weight: 700; color: #0f172a;">${data.suiteName}</h2>
        <div style="font-size: 13px; color: #64748b;">
          Target Stage: <strong style="color: #0052cc;">${data.envName}</strong> &bull; Browser: <strong style="color: #334155; text-transform: uppercase;">${data.browser}</strong>
        </div>
      </td>
    </tr>

    <!-- KPI Metric Cards Grid -->
    <tr>
      <td style="padding: 0 30px 20px;">
        <table width="100%" border="0" cellpadding="0" cellspacing="8">
          <tr>
            <td width="33%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; text-align: center;">
              <div style="font-size: 11px; color: #64748b; font-weight: 600; text-transform: uppercase;">Pass Rate</div>
              <div style="font-size: 24px; font-weight: 800; color: ${isPassed ? '#059669' : '#dc2626'}; margin-top: 4px;">${passRate}%</div>
              <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">${passCount} / ${total} Tests</div>
            </td>
            <td width="33%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; text-align: center;">
              <div style="font-size: 11px; color: #64748b; font-weight: 600; text-transform: uppercase;">Duration</div>
              <div style="font-size: 24px; font-weight: 800; color: #0284c7; margin-top: 4px;">${durationSec}</div>
              <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">Velocity</div>
            </td>
            <td width="33%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; text-align: center;">
              <div style="font-size: 11px; color: #64748b; font-weight: 600; text-transform: uppercase;">Failures</div>
              <div style="font-size: 24px; font-weight: 800; color: ${failCount > 0 ? '#dc2626' : '#059669'}; margin-top: 4px;">${failCount}</div>
              <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">Blocking Issues</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Root Cause Analysis if failed -->
    ${rcaSectionHtml ? `<tr><td style="padding: 0 30px 24px;">${rcaSectionHtml}</td></tr>` : ''}

    <!-- Call to Action Buttons -->
    <tr>
      <td style="padding: 10px 30px 28px; text-align: center;">
        <table align="center" border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding-right: 12px;">
              <a href="${reportUrl}" target="_blank" style="display: inline-block; background-color: #0052cc; color: #ffffff; text-decoration: none; padding: 12px 22px; border-radius: 6px; font-size: 13px; font-weight: 600; box-shadow: 0 2px 8px rgba(0, 82, 204, 0.3);">📊 Open Quality Report ↗</a>
            </td>
            <td>
              <a href="${dashboardUrl}" target="_blank" style="display: inline-block; background-color: #f1f5f9; color: #334155; border: 1px solid #cbd5e1; text-decoration: none; padding: 12px 20px; border-radius: 6px; font-size: 13px; font-weight: 600;">🖥️ Open Live Dashboard</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding: 20px 30px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #94a3b8;">
        <div>Automated Quality Governance &bull; Enterprise Test Intelligence Engine</div>
        <div style="margin-top: 4px;">Timestamp: ${new Date().toUTCString()}</div>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

module.exports = {
  generateExecutiveEmailHtml,
};
