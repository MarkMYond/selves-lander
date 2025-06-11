// SEO Audit Utility
export interface SEOAuditResult {
  score: number
  issues: SEOIssue[]
  recommendations: string[]
}

export interface SEOIssue {
  type: 'error' | 'warning' | 'info'
  category: 'meta' | 'content' | 'performance' | 'structure'
  message: string
  element?: string
}

export function auditPageSEO(): SEOAuditResult {
  const issues: SEOIssue[] = []
  const recommendations: string[] = []

  // Check for title tag
  const title = document.querySelector('title')?.textContent
  if (!title) {
    issues.push({
      type: 'error',
      category: 'meta',
      message: 'Missing title tag',
    })
  } else if (title.length > 60) {
    issues.push({
      type: 'warning',
      category: 'meta',
      message: `Title too long (${title.length} chars). Recommended: 50-60 characters`,
    })
  } else if (title.length < 30) {
    issues.push({
      type: 'warning',
      category: 'meta',
      message: `Title too short (${title.length} chars). Recommended: 50-60 characters`,
    })
  }

  // Check for meta description
  const description = document.querySelector('meta[name="description"]')?.getAttribute('content')
  if (!description) {
    issues.push({
      type: 'error',
      category: 'meta',
      message: 'Missing meta description',
    })
  } else if (description.length > 160) {
    issues.push({
      type: 'warning',
      category: 'meta',
      message: `Meta description too long (${description.length} chars). Recommended: 120-160 characters`,
    })
  }

  // Check for canonical URL
  const canonical = document.querySelector('link[rel="canonical"]')
  if (!canonical) {
    issues.push({
      type: 'warning',
      category: 'meta',
      message: 'Missing canonical URL',
    })
  }

  // Check for Open Graph tags
  const ogTitle = document.querySelector('meta[property="og:title"]')
  const ogDescription = document.querySelector('meta[property="og:description"]')
  const ogImage = document.querySelector('meta[property="og:image"]')

  if (!ogTitle) {
    issues.push({
      type: 'warning',
      category: 'meta',
      message: 'Missing Open Graph title',
    })
  }

  if (!ogDescription) {
    issues.push({
      type: 'warning',
      category: 'meta',
      message: 'Missing Open Graph description',
    })
  }

  if (!ogImage) {
    issues.push({
      type: 'warning',
      category: 'meta',
      message: 'Missing Open Graph image',
    })
  }

  // Check for structured data
  const jsonLd = document.querySelector('script[type="application/ld+json"]')
  if (!jsonLd) {
    issues.push({
      type: 'info',
      category: 'structure',
      message: 'No JSON-LD structured data found',
    })
  }

  // Check for heading structure
  const h1Elements = document.querySelectorAll('h1')
  if (h1Elements.length === 0) {
    issues.push({
      type: 'error',
      category: 'content',
      message: 'Missing H1 heading',
    })
  } else if (h1Elements.length > 1) {
    issues.push({
      type: 'warning',
      category: 'content',
      message: `Multiple H1 headings found (${h1Elements.length}). Recommended: 1 per page`,
    })
  }

  // Generate recommendations
  if (issues.length === 0) {
    recommendations.push('Great! No major SEO issues found.')
  } else {
    const errorCount = issues.filter(i => i.type === 'error').length
    const warningCount = issues.filter(i => i.type === 'warning').length

    if (errorCount > 0) {
      recommendations.push(`Fix ${errorCount} critical SEO error(s)`)
    }
    if (warningCount > 0) {
      recommendations.push(`Address ${warningCount} SEO warning(s)`)
    }
    
    recommendations.push('Run regular SEO audits to maintain optimal performance')
    recommendations.push('Test pages with Google Search Console')
  }

  // Calculate score (basic scoring algorithm)
  const totalIssues = issues.length
  const errorWeight = 20
  const warningWeight = 10
  const infoWeight = 5

  const scoreDeduction = issues.reduce((total, issue) => {
    switch (issue.type) {
      case 'error': return total + errorWeight
      case 'warning': return total + warningWeight
      case 'info': return total + infoWeight
      default: return total
    }
  }, 0)

  const score = Math.max(0, 100 - scoreDeduction)

  return {
    score,
    issues,
    recommendations,
  }
}

// Development helper to run SEO audit
export function runSEOAudit() {
  if (process.env.NODE_ENV === 'development') {
    const audit = auditPageSEO()
    console.group('🔍 SEO Audit Report')
    console.log(`Score: ${audit.score}/100`)
    
    if (audit.issues.length > 0) {
      console.group('Issues:')
      audit.issues.forEach(issue => {
        const icon = issue.type === 'error' ? '❌' : issue.type === 'warning' ? '⚠️' : 'ℹ️'
        console.log(`${icon} [${issue.category}] ${issue.message}`)
      })
      console.groupEnd()
    }

    if (audit.recommendations.length > 0) {
      console.group('Recommendations:')
      audit.recommendations.forEach(rec => console.log(`💡 ${rec}`))
      console.groupEnd()
    }
    
    console.groupEnd()
  }
}
