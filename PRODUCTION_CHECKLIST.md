# 🚀 CustomHeroes.ai Production Readiness Checklist

## 🔥 CRITICAL - Must Do Immediately

### 1. Environment Variables in Vercel
Go to Vercel Dashboard → Your Project → Settings → Environment Variables

Add these variables:

```bash
# Base URL for your production site
NEXT_PUBLIC_BASE_URL=https://customheroes.ai

# AI Service URL (if you have a separate AI service)
NEXT_PUBLIC_AI_SERVICE_URL=https://your-ai-service-url.com

# Stripe Configuration (PRODUCTION KEYS)
STRIPE_SECRET_KEY=sk_live_your_production_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_production_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_production_webhook_secret

# Database (already configured)
DATABASE_URL=postgres://neondb_owner:npg_NYUVJs1e2TtP@ep-summer-butterfly-a4pjdku8-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require

# Email Service (already configured)
RESEND_API_KEY=re_Xmw1YH4r_E8UGSKMmCfEn3GC3rV3BtTUu

# File Storage (already configured)
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_wfw2amjvLJWZNU2k_lrcIgtPX5bhN7LBg9GyliIvruAolXj

# Auth (if using Stack Auth)
NEXT_PUBLIC_STACK_PROJECT_ID=56a489d1-0c8e-4a5f-b1ee-8a1acc5423a9
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=pck_qgs0qj8sa9wjnzqcbcfb3q2w1qzm9f5trsfv28phqjax0
```

### 2. Stripe Webhook Configuration
**CRITICAL: Gift cards won't work without this!**

1. Go to Stripe Dashboard → Webhooks
2. Create new webhook endpoint: `https://customheroes.ai/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
4. Copy the webhook secret and add to Vercel env vars as `STRIPE_WEBHOOK_SECRET`

### 3. Domain Configuration
1. In your domain registrar (GoDaddy, Namecheap, etc.)
2. Add CNAME record: `customheroes.ai` → `cname.vercel-dns.com`
3. In Vercel Dashboard → Your Project → Settings → Domains
4. Add `customheroes.ai` as custom domain

## 🔶 HIGH PRIORITY - Do Within 24 Hours

### 4. Switch to Stripe Production Keys
1. Go to Stripe Dashboard → Toggle to "Live mode"
2. Get your live API keys
3. Update environment variables in Vercel
4. Test a real transaction

### 5. Email Domain Authentication
1. In Resend Dashboard → Domains
2. Add `customheroes.ai` domain
3. Configure DNS records for email authentication
4. Update email templates to use `@customheroes.ai`

### 6. Security Headers
Add to `next.config.js`:

```javascript
const nextConfig = {
  // ... existing config
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },
}
```

## 🔷 MEDIUM PRIORITY - Do Within Week

### 7. Analytics Setup
- Add Google Analytics 4
- Set up conversion tracking for purchases
- Monitor user behavior and checkout funnel

### 8. Error Monitoring
- Set up Sentry for error tracking
- Configure alerts for critical errors
- Monitor API endpoint performance

### 9. Performance Optimization
- Enable Vercel Analytics
- Set up Core Web Vitals monitoring
- Optimize images and fonts

### 10. SEO Optimization
- Add proper meta tags
- Create sitemap.xml
- Set up Google Search Console
- Add structured data for products

## 🔵 LOW PRIORITY - Nice to Have

### 11. Backup Strategy
- Set up automated database backups
- Document recovery procedures
- Test backup restoration

### 12. Monitoring & Alerts
- Set up uptime monitoring (UptimeRobot, Pingdom)
- Configure alerts for downtime
- Monitor database performance

### 13. Legal Compliance
- GDPR compliance (if serving EU customers)
- CCPA compliance (if serving CA customers)
- Cookie consent banner
- Data retention policies

## ✅ Verification Steps

After completing the critical items:

1. **Test Gift Card Flow**: Purchase → Email → Redemption
2. **Test Order Flow**: Create book → Payment → Confirmation
3. **Test Email Delivery**: All notification emails working
4. **Test Domain**: `https://customheroes.ai` loads correctly
5. **Test SSL**: Green lock icon in browser
6. **Test Mobile**: Responsive design works on all devices

## 🚨 Emergency Contacts

- **Stripe Support**: https://support.stripe.com
- **Vercel Support**: https://vercel.com/help
- **Resend Support**: https://resend.com/support
- **Neon Support**: https://neon.tech/docs/support

---

**Status**: 🟡 In Progress
**Last Updated**: 2025-05-30
**Next Review**: After critical items completed
