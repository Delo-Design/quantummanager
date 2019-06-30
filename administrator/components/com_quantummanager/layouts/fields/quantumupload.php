<?php
/**
 * @package    quantummanager
 *
 * @author     Cymbal <cymbal@delo-design.ru>
 * @copyright  Copyright (C) 2019 "Delo Design". All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 * @link       https://delo-design.ru
 */

defined('JPATH_PLATFORM') or die;
use Joomla\CMS\Language\Text;
?>

<div class="quantummanager-module quantumupload-module" data-type="Qantumupload" data-options="maxsize:<?php echo $displayData['maxsize'] ?>;directory:<?php echo $displayData['directory'] ?>;dropAreaHidden:<?php echo $displayData['dropAreaHidden'] ?>">

	<?php $id = rand(11111, 99999)?>
    <div class="drop-area <?php if($displayData['dropAreaHidden'] === '1') : ?> drop-area-hidden <?php endif; ?>">
        <div class="form-upload">
            <input type="hidden" class="pathElem" name="path">
            <span class="quantummanager-icon quantummanager-icon-upload"></span>
            <p><?= \Joomla\CMS\Language\Text::_("COM_QUANTUMMANAGER_FIELDS_QUANTUMUPLOAD_UPLOAD_DROP") ?></p>
            <label class="button" for="fileElem-<?= $id ?>"><?= \Joomla\CMS\Language\Text::_("COM_QUANTUMMANAGER_FIELDS_QUANTUMUPLOAD_UPLOAD_SELECT") ?></label>
            <input type="file" id="fileElem-<?= $id ?>" class="fileElem" multiple accept="*">
        </div>
    </div>

    <progress class="progress-bar" max="100" value="0"></progress>

    <div class="upload-errors">
        <div></div>
        <a class="uk-alert-close uk-close uk-icon upload-errors-close" uk-close=""><svg width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg"><line fill="none" stroke="#000" stroke-width="1.1" x1="1" y1="1" x2="13" y2="13"></line><line fill="none" stroke="#000" stroke-width="1.1" x1="13" y1="1" x2="1" y2="13"></line></svg></a>
    </div>

</div>


<script type="text/javascript">
    window.QuantumuploadLang = {
        'dragDrop': '<?php echo Text::_('COM_QUANTUMMANAGER_FIELDS_QUANTUMUPLOAD_DRAG_DROP'); ?>',
        'file': '<?php echo Text::_('COM_QUANTUMMANAGER_FIELDS_QUANTUMUPLOAD_UPLOAD_ERROR_FILE'); ?>',
        'megabyte': '<?php echo Text::_('COM_QUANTUMMANAGER_FIELDS_QUANTUMUPLOAD_UPLOAD_ERROR_MEGABITE'); ?>',
        'maxsize': '<?php echo Text::_('COM_QUANTUMMANAGER_FIELDS_QUANTUMUPLOAD_UPLOAD_ERROR_MAXSIZE'); ?>',
        'exs': '<?php echo Text::_('COM_QUANTUMMANAGER_FIELDS_QUANTUMUPLOAD_UPLOAD_ERROR_EXS'); ?>',
    };
</script>
