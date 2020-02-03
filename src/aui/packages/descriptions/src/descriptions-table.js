export default {
  name: 'AuiDescriptionsTable',
  functional: true,
  render(h, context) {
    const { column, layout, value: fields, labelWidth, labelColor, contentWidth } = context.props

    const rows = []
    let rowItem = []
    let currentIndex = 0
    let totalCol = 0
    let styles = {}

    if (layout === 'horizontal') {
      fields.forEach((fieldItem, fieldIndex) => {
        if (layout === 'horizontal') {
          const { span } = fieldItem
          let colSpan = 1

          if (fieldItem.label) {
            if (fieldItem.span !== 1) {
              if (!fieldItem.$slots.default) {
                colSpan = span * 2
              }
            }
          }

          totalCol += colSpan

          if (fieldItem.$slots.default) {
            if (span !== 1) {
              colSpan = span * 2 - 1
            }
          }

          totalCol += colSpan
        }
      })
    }

    const totalRow = Math.ceil(totalCol / (column * 2))

    fields.forEach((fieldItem, fieldIndex) => {
      if (layout === 'horizontal') {
        const { span, label } = fieldItem
        let colSpan = 1

        if (fieldItem.label) {
          if (fieldIndex !== fields.length - 1) {
            if (fieldItem.span !== 1) {
              if (!fieldItem.$slots.default) {
                colSpan = span * 2
              }
            }
          } else {
            if (!fieldItem.$slots.default) {
              colSpan = totalRow * column * 2 - currentIndex
            }
          }

          styles = {
            'text-align': fieldItem.align,
            width: labelWidth
          }

          if (labelColor) {
            styles['background-color'] = labelColor
          }

          rowItem.push(
            <th class='aui-descriptions-item-label' colspan={colSpan} style={styles}>
              {label}
            </th>
          )
        }

        currentIndex += colSpan

        if (fieldItem.$slots.default) {
          if (fieldIndex !== fields.length - 1) {
            if (span !== 1) {
              colSpan = span * 2 - 1
            }
          } else {
            colSpan = totalRow * column * 2 - currentIndex
          }

          styles = {
            'text-align': fieldItem.align
          }

          if (contentWidth) {
            styles.width = contentWidth
          }

          rowItem.push(
            <td class='aui-descriptions-item-content' colspan={colSpan} style={styles}>
              {fieldItem.$slots.default}
            </td>
          )
        }

        currentIndex += colSpan

        if (currentIndex % (column * 2) === 0 && fieldIndex !== fields.length - 1) {
          rows.push(<tr class='aui-descriptions-row'>{rowItem}</tr>)

          rowItem = []
        }

        if (fieldIndex === fields.length - 1) {
          rows.push(<tr class='aui-descriptions-row'>{rowItem}</tr>)

          rowItem = []
        }
      }
    })

    return (
      <table>
        <tbody>{rows}</tbody>
      </table>
    )
  }
}
