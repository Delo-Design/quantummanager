<?php
/**
 * @package    quantummanager
 * @author     Dmitry Tsymbal <cymbal@delo-design.ru>
 * @copyright  Copyright © 2019 Delo Design & NorrNext. All rights reserved.
 * @license    GNU General Public License version 3 or later; see license.txt
 * @link       https://www.norrnext.com
 */

defined('_JEXEC') or die;

use Joomla\CMS\Language\Text;
extract($displayData);

?>

<div class="quantummanager-module quantumunsplash-module" data-type="Quantumunsplash" data-options="">
    <div class="quantumunsplash-save">
        <div class="loader"><?php echo Text::_('COM_QUANTUMMANAGER_FIELDS_QUANTUMUNSPLASH_SAVE'); ?><span></span><span></span><span></span><span></span></div>
    </div>
    <div class="quantumunsplash-module-container">

        <div class="quantumunsplash-module-header">
	        <label>
		        <input name="q" type="text" placeholder="<?php echo Text::_('COM_QUANTUMMANAGER_FIELDS_QUANTUMUNSPLASH_SEARCH'); ?>">
	        </label>
        </div>

        <div class="quantumunsplash-module-container-search-wrap">
            <div class="quantumunsplash-module-container-search">
                <div class="quantumunsplash-module-search grid"></div>
                <div class="quantumunsplash-module-load-page">
                    <button class="btn"><?php echo Text::_('COM_QUANTUMMANAGER_FIELDS_QUANTUMUNSPLASH_BUTTON_LOAD'); ?></button>
                </div>
            </div>
        </div>

        <button class="quantumunsplash-module-close btn"><span class="quantummanager-icon quantummanager-icon-close"></span> <?php echo Text::_('COM_QUANTUMMANAGER_FIELDS_QUANTUMUNSPLASH_CLOSE'); ?></button>
    </div>

</div>

<script type="text/javascript">
    window.QuantumunsplashLang = {
        'button': '<?php echo Text::_('COM_QUANTUMMANAGER_FIELDS_QUANTUMUNSPLASH_BUTTON'); ?>',
        'buttonLoad': '<?php echo Text::_('COM_QUANTUMMANAGER_FIELDS_QUANTUMUNSPLASH_BUTTON_LOAD'); ?>',
        'save': '<?php echo Text::_('COM_QUANTUMMANAGER_FIELDS_QUANTUMUNSPLASH_SAVE'); ?>',
        'close': '<?php echo Text::_('COM_QUANTUMMANAGER_FIELDS_QUANTUMUNSPLASH_CLOSE'); ?>',
        'search': '<?php echo Text::_('COM_QUANTUMMANAGER_FIELDS_QUANTUMUNSPLASH_SEARCH'); ?>',
        'searchHelper': '<?php echo Text::_('COM_QUANTUMMANAGER_FIELDS_QUANTUMUNSPLASH_SEARCH_HELPER'); ?>',
    };
</script>