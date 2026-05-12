/**
 * istoc.com — ECharts mobil-uyumlu yardımcı
 *
 * Tüm sayfa charts'larını izler:
 *  - window resize'da otomatik resize
 *  - Container ResizeObserver ile takip
 *  - Mobil viewport için label/legend/grid tweak'leri uygular
 *
 * Kullanım: sayfada normal echarts.init() çağrıları yapılır;
 *  bu script otomatik olarak tüm instance'ları yakalar.
 */
(function () {
  if (typeof echarts === 'undefined') return;

  /** @type {Set<any>} */
  const instances = new Set();

  // echarts.init'i yakala
  const origInit = echarts.init;
  echarts.init = function (el, theme, opts) {
    const inst = origInit.call(echarts, el, theme, opts);
    instances.add(inst);
    return inst;
  };

  // Resize tetik
  let resizeRaf = 0;
  function scheduleResize() {
    if (resizeRaf) cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(function () {
      instances.forEach(function (i) { try { i.resize(); } catch (e) {} });
    });
  }
  window.addEventListener('resize', scheduleResize, { passive: true });
  window.addEventListener('orientationchange', scheduleResize, { passive: true });

  // .chart container'larını gözlemle (içeriğe sığması için)
  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(scheduleResize);
    document.addEventListener('DOMContentLoaded', function () {
      document.querySelectorAll('.chart').forEach(function (el) { ro.observe(el); });
    });
  }

  /**
   * Mobil tablo kart-stack için her td'ye data-th ekle (sütun başlığı)
   * Bu sayede mobilde "Tür · Inbound" gibi etiketli görünür.
   */
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('table.tbl').forEach(function (tbl) {
      const headers = Array.from(tbl.querySelectorAll('thead th')).map(function (th) {
        return th.textContent.trim();
      });
      if (!headers.length) return;
      tbl.querySelectorAll('tbody tr, tfoot tr').forEach(function (tr) {
        let idx = 0;
        tr.querySelectorAll('td').forEach(function (td) {
          const span = parseInt(td.getAttribute('colspan') || '1', 10);
          // İlk hücreyi başlık olarak kullandığımızdan etiket koymuyoruz
          if (idx > 0 && !td.hasAttribute('data-th') && headers[idx]) {
            td.setAttribute('data-th', headers[idx]);
          }
          idx += span;
        });
      });
    });
  });

  /**
   * Mobil-aware option helper
   * Pie/donut için: label dışarı yerine center, daha küçük radius
   * Legend için: scroll + bottom + küçük item gap
   */
  window.ISTOC = window.ISTOC || {};
  window.ISTOC.responsivePie = function (baseOption) {
    return {
      baseOption: baseOption,
      media: [
        {
          query: { maxWidth: 640 },
          option: {
            legend: {
              orient: 'horizontal',
              bottom: 0,
              left: 'center',
              type: 'scroll',
              itemGap: 6,
              textStyle: { fontSize: 11 }
            },
            series: (baseOption.series || []).map(function (s) {
              if (s.type === 'pie') {
                return Object.assign({}, s, {
                  radius: ['35%', '58%'],
                  center: ['50%', '42%'],
                  label: { show: false },
                  labelLine: { show: false }
                });
              }
              return s;
            })
          }
        },
        {
          query: { minWidth: 641 },
          option: baseOption
        }
      ]
    };
  };

  /** Çubuk/çizgi grafiklerde mobil grid sıkıştırma */
  window.ISTOC.responsiveCartesian = function (baseOption) {
    return {
      baseOption: baseOption,
      media: [
        {
          query: { maxWidth: 640 },
          option: {
            grid: { left: 50, right: 14, top: 56, bottom: 36 },
            legend: { type: 'scroll', textStyle: { fontSize: 11 } },
            xAxis: Array.isArray(baseOption.xAxis)
              ? baseOption.xAxis.map(function (a) { return Object.assign({}, a, { axisLabel: Object.assign({}, a.axisLabel || {}, { fontSize: 10, rotate: 30 }) }); })
              : Object.assign({}, baseOption.xAxis, {
                  axisLabel: Object.assign({}, (baseOption.xAxis || {}).axisLabel || {}, { fontSize: 10, rotate: 30 })
                }),
            yAxis: Array.isArray(baseOption.yAxis)
              ? baseOption.yAxis.map(function (a) { return Object.assign({}, a, { axisLabel: Object.assign({}, a.axisLabel || {}, { fontSize: 10 }) }); })
              : Object.assign({}, baseOption.yAxis, {
                  axisLabel: Object.assign({}, (baseOption.yAxis || {}).axisLabel || {}, { fontSize: 10 })
                })
          }
        },
        { query: { minWidth: 641 }, option: baseOption }
      ]
    };
  };

  /** Tree mindmap mobil: daha kompakt */
  window.ISTOC.responsiveTree = function (baseOption) {
    return {
      baseOption: baseOption,
      media: [
        {
          query: { maxWidth: 640 },
          option: {
            series: (baseOption.series || []).map(function (s) {
              if (s.type === 'tree') {
                return Object.assign({}, s, {
                  top: '2%', left: '4%', bottom: '2%', right: '24%',
                  label: Object.assign({}, s.label || {}, { fontSize: 10 }),
                  leaves: Object.assign({}, s.leaves || {}, {
                    label: Object.assign({}, ((s.leaves || {}).label) || {}, { fontSize: 10 })
                  }),
                  symbolSize: 6,
                  initialTreeDepth: 1
                });
              }
              return s;
            })
          }
        },
        { query: { minWidth: 641 }, option: baseOption }
      ]
    };
  };

  /** Heatmap mobil: visualMap dikey & sağda, label gizli */
  window.ISTOC.responsiveHeatmap = function (baseOption) {
    return {
      baseOption: baseOption,
      media: [
        {
          query: { maxWidth: 640 },
          option: {
            grid: { left: 80, right: 20, top: 36, bottom: 60 },
            xAxis: Object.assign({}, baseOption.xAxis || {}, {
              axisLabel: Object.assign({}, ((baseOption.xAxis || {}).axisLabel || {}), { fontSize: 10, rotate: 45 })
            }),
            yAxis: Object.assign({}, baseOption.yAxis || {}, {
              axisLabel: Object.assign({}, ((baseOption.yAxis || {}).axisLabel || {}), { fontSize: 10 })
            }),
            visualMap: Object.assign({}, baseOption.visualMap || {}, {
              orient: 'horizontal', left: 'center', bottom: 0, itemWidth: 12, itemHeight: 100,
              textStyle: { fontSize: 10 }
            }),
            series: (baseOption.series || []).map(function (s) {
              if (s.type === 'heatmap') {
                return Object.assign({}, s, { label: Object.assign({}, s.label || {}, { fontSize: 9 }) });
              }
              return s;
            })
          }
        },
        { query: { minWidth: 641 }, option: baseOption }
      ]
    };
  };
})();
